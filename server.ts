import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === "production";

  console.log(`Starting server in ${isProduction ? "production" : "development"} mode...`);

  app.use((req, res, next) => {
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

  // Vite middleware or static serving
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, server.cjs is in /dist, so the static files are in the same directory.
    // path.resolve(__dirname) ensures we have an absolute path.
    const distPath = path.resolve(__dirname);
    
    console.log(`Starting production server...`);
    console.log(`Dist path: ${distPath}`);
    
    configMimeTypes(app);

    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Static file serving error");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function configMimeTypes(app: any) {
  app.use((req: any, res: any, next: any) => {
    const ext = path.extname(req.url);
    if (ext === ".js") {
      res.setHeader("Content-Type", "application/javascript");
    } else if (ext === ".css") {
      res.setHeader("Content-Type", "text/css");
    } else if (ext === ".html") {
      res.setHeader("Content-Type", "text/html");
    }
    next();
  });
}

startServer();
