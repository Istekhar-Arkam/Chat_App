import express from "express";
import cors from "cors";
import http from "http";
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use("/api/status", (req, res) => res.send("Server is live"));

export { app };
