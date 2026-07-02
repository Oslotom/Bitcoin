import express from "express";
import axios from "axios";
import path from "path";
import { Resend } from 'resend';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === "production";

  console.log(`Starting server in ${isProduction ? "production" : "development"} mode...`);

  app.use(express.json());

  app.use((req, res, next) => {
    const host = req.get("host");
    if (host && host.startsWith("www.")) {
      const newHost = host.slice(4);
      return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
    }
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Proxy for NBX API
  app.get("/api/proxy/nbx", async (req, res) => {
    try {
      const response = await axios.get("https://api.nbx.com/tickers");
      res.json(response.data);
    } catch (error) {
      console.error("Error proxying NBX API:", error);
      res.status(500).json({ error: "Failed to fetch NBX data" });
    }
  });

  // Proxy for Bare Bitcoin API
  app.get("/api/proxy/bare-bitcoin", async (req, res) => {
    try {
      const response = await axios.get("https://api.bb.no/v1/price/nok");
      res.json(response.data);
    } catch (error) {
      console.error("Error proxying Bare Bitcoin API:", error);
      res.status(500).json({ error: "Failed to fetch Bare Bitcoin data" });
    }
  });

  // Proxy for CoinGecko price API
  app.get("/api/proxy/coingecko", async (req, res) => {
    try {
      const { ids, vs_currencies } = req.query;
      const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: { ids, vs_currencies }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error proxying CoinGecko API:", error);
      res.status(500).json({ error: "Failed to fetch CoinGecko data" });
    }
  });

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
        console.warn("RESEND_API_KEY mangler. E-post ble ikke sendt, men forespørsel er logget.");
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
    
    // Serve static files with explicit MIME types
    app.use(express.static(distPath, {
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

    // Redirect www to apex (non-www)
    app.use((req, res, next) => {
      const host = req.get("host");
      if (host && host.startsWith("www.xn--")) {
        return res.redirect(301, `https://xn--kjpebitcoin-hgb.no${req.originalUrl}`);
      }
      next();
    });
    
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

      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
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
