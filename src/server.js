import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
//
const server = express();
const port = process.env.PORT || 3003;
//
server.use(cors());
server.use(express.json());
// let onlineUsers
//
server.use("/room", RoomRouter);
//
const httpServer = createServer(server);
const io = new Server(httpServer);
//
io.on("connection", () => {});

if (!process.env.MONGO_URL) {
  throw new Error("No MongoDB uri defined");
}
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to mongo");
  httpServer.listen(3030);
});
