import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import RoomRouter from "./room/room.js";
import listEndpoints from "express-list-endpoints";
import RoomSchema from "./room/schema.js";
//
const server = express();
const port = process.env.PORT || 3003;
//
server.use(cors());
server.use(express.json());
let onlineUsers = [];
//
server.use("/room", RoomRouter);
//
const httpServer = createServer(server);
const io = new Server(httpServer);
//
io.on("connection", (socket) => {
  //
  socket.on("setUsername", async ({ username, room }) => {
    if (!room) room = socket.id;
    socket.join(room);
    const thisRoom = await RoomSchema.findOne({ room: room });
    if (thisRoom) {
      const newUser = { username, socketId: socket.id };
      thisRoom.onlineUsers = [...thisRoom.onlineUsers, newUser];
      await thisRoom.save();
      socket.emit("newConnection", thisRoom);
    } else {
      const newUser = { username, socketId: socket.id };
      const newRoom = new RoomSchema({ room: room, onlineUsers: [newUser] });
      await newRoom.save();
      socket.emit("newConnection", newRoom);
    }
  });
  //
  socket.on("sendMess", async ({ username, room, message }) => {
    socket.join(room);
    const newMessage = {
      username,
      message: message,
      timestamp: new Date(),
      id: socket.id,
    };
    await RoomSchema.findOneAndUpdate(
      { room },
      {
        $push: { chatHistory: newMessage },
      },
      { new: true }
    );
    socket.to(room).emit("messages", newMessage);
  });
  socket.on("disconnectUser", async ({ room, username }) => {
    let findRoom = await RoomSchema.findOne({ room });
    const list = findRoom.onlineUsers.filter((u) => u.username !== username);
    findRoom.onlineUsers = list;
    await findRoom.save();
  });
  //
  socket.on("disconnect", async () => {
    // const rooms = await RoomSchema.find();
    // console.log(rooms);
    // const filterUser = rooms.filter((r) =>
    //   r.onlineUsers.some((u) => u.socketId !== socket.id)
    // );
    // console.log(filterUser);
    // await rooms.save();
    // thisRoom.onlineUsers.filter((u) => u !== username);
    // await thisRoom.save();
    console.log("Disconected ->", socket.id);
    // console.log("Disconected ->", thisRoom);
  });
});
//
if (!process.env.MONGO_CONNECTION) {
  throw new Error("No MongoDB uri defined");
}
mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
  console.log("connected to mongo");
  httpServer.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`🚀 => ${port}`);
  });
});
