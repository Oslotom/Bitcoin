import express from "express";
import path from "path";
import { Resend } from 'resend';
import { PAGE_PATHS, REDIRECTS } from './src/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === "production";

  console.log(`Starting server in ${isProduction ? "production" : "development"} mode...`);

  app.use(express.json());

  // Contact form API
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Navn, e-post og melding er påkrevd." });
      }

      console.log(`Ny kontaktforespørsel fra ${name} (${email}): ${subject}`);

      const resendKey = process.env.RESEND_API_KEY;
      
      if (resendKey) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Kjøpebitcoin.no <onboarding@resend.dev>',
          to: 'tomhaugeplass@gmail.com',
          subject: `Kontaktform: ${subject || 'Ny melding'}`,
          replyTo: email,
          html: `
            <h3>Ny melding fra kontaktskjema</h3>
            <p><strong>Navn:</strong> ${name}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Emne:</strong> ${subject}</p>
            <p><strong>Melding:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
        console.log("E-post sendt via Resend.");
      } else {
        return res.status(503).json({ error: "E-post er ikke konfigurert. Bruk e-postlenken på siden." });
      }

      res.status(200).json({ status: "ok", message: "Meldingen er mottatt." });
    } catch (error) {
      console.error("Feil ved mottak av kontaktform:", error);
      res.status(500).json({ error: "Kunne ikke motta meldingen." });
    }
  });

  // Vite middleware or static serving
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    
    console.log(`Production mode: Serving static files from ${distPath}`);
    
    // Canonical host and legacy redirects must run before static serving.
    app.use((req, res, next) => {
      if (req.hostname === 'xn--kjpebitcoin-hgb.no') {
        return res.redirect(301, `https://www.xn--kjpebitcoin-hgb.no${req.originalUrl}`);
      }
      const clean = req.path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
      const targetPage = REDIRECTS[clean];
      const destination = targetPage ? PAGE_PATHS[targetPage] : clean;
      const known = Object.values(PAGE_PATHS).includes(clean);
      if (targetPage || (known && req.path !== clean)) {
        const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
        return res.redirect(301, destination + query);
      }
      next();
    });

    // Serve prerendered pages at their extensionless canonical URL.
    app.use(express.static(distPath, {
      extensions: ['html'],
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === ".js" || ext === ".mjs") {
          res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
          res.setHeader("X-Content-Type-Options", "nosniff");
        } else if (ext === ".css") {
          res.setHeader("Content-Type", "text/css; charset=UTF-8");
        } else if (ext === ".html") {
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
        } else if (ext === ".png") {
          res.setHeader("Content-Type", "image/png");
        } else if (ext === ".jpg" || ext === ".jpeg") {
          res.setHeader("Content-Type", "image/jpeg");
        } else if (ext === ".svg") {
          res.setHeader("Content-Type", "image/svg+xml");
        } else if (ext === ".ico") {
          res.setHeader("Content-Type", "image/x-icon");
        }
      }
    }));

    // Handle SPA routing
    app.get("*", (req, res) => {
      const url = req.url.split('?')[0]; // Ignore query params
      
      // Specifically handle common static file extensions that might have reached here (meaning they are missing)
      const missingFileExts = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
      const ext = path.extname(url).toLowerCase();
      
      if (url.startsWith("/assets/") || missingFileExts.includes(ext)) {
        console.warn(`Static asset or file extension not found: ${url}`);
        return res.status(404).type('text/plain').send("Not found");
      }

      const indexPath = path.join(distPath, "404.html");
      res.status(404).sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
          if (!res.headersSent) {
            res.status(500).type('text/plain').send("Static file serving error");
          }
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
