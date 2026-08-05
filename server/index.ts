import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handlePaynowInitiate, handlePaynowResult } from "./routes/paynow";
import { handlePaynowConfig } from "./routes/paynow-config";
import { handleContact } from "./routes/contact";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/paynow/initiate", handlePaynowInitiate);
  app.post("/api/paynow/result", handlePaynowResult);
  app.get("/api/paynow/config", handlePaynowConfig);
  app.post("/api/contact", handleContact);

  return app;
}
