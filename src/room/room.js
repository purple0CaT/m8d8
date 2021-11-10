import express from "express";
import RoomSchema from "./schema.js";

const RoomRouter = express.Router();
RoomRouter.get("/:room", async (req, res, next) => {
  const room = await RoomSchema.findOne({ room: req.params.room });
  res.send(room);
});
export default RoomRouter;
