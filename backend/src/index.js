import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

// connect to mongoDB and start the server
await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server1 is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!", error);
    throw error;
  });
