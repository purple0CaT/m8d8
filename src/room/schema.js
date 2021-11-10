import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  username: { type: String },
  message: { type: String },
  timestamp: { type: Number },
  id: { type: String },
});
const UserSchema = new Schema({
  username: { type: String, required: true },
  socketId: { type: String, required: true },
});
const RoomSchema = new Schema({
  chatHistory: { type: [MessageSchema], required: true, default: [] },
  room: { type: String },
  onlineUsers: { type: [UserSchema], default: [] },
});

export default model("Room", RoomSchema);
