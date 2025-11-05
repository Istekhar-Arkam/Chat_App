import express from "express";
import cors from "cors";
import http from "http";
import userRouter from "./routes/userRoutes.js";
const app = express();
const server = http.createServer(app);

// middlewares setup

app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// routes setup

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server2 is running on port ${PORT}`);
});

export { app };
