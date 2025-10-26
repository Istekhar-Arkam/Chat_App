import dotenv from "dotenv"
import express from "express"
import http from "http"
import connectDB from "./db/index.js";

//create express app and http server used in socket.io
const app=express();
const server=http.createServer(app);

dotenv.config({
  path:"./env"
})
connectDB()

// middleware setup

