import "dotenv/config"
import express from "express";
import cors from "cors";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import { Server } from "socket.io";
import connectDB from "./db/index.js";
const app = express();
const server = http.createServer(app);

// Socket.io setup

export const io = new Server(server, {
  cors: { origin: "*" },
});

//store online users

export const userSocketMap = {}; //{userId:socketId}

// socket.io connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId}`);
  if (userId) userSocketMap[userId] = socket.id;

  // emit online user to all connected clients

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middlewares setup

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes setup

//

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messagesRouter);

// connect to mongodb

await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => console.log("Server is running on port :"+ PORT));
}

//export server for versal

export default server;
