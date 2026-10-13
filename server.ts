import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import app from "./api/index";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(".", "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(".", "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[RawClip Server] Running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
