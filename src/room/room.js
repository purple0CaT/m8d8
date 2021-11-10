import express from "express";

const RoomRouter = express.Router();
RoomRouter.get("/", async (req, res, next) => {
  res.send("ok");
});
export default RoomRouter;
