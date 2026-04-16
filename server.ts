import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
