import express from "express"
import "dotenv/config"
import cors from "cors";
import http from "http"

//create express app and http server used in socket.io
const app=express()
const server=http.createServer(app)

// middleware setup