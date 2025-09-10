import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUsersData } from "../controller/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/data", userAuth, getUsersData);

export default usersRouter;
