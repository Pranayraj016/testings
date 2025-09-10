import express from "express";
import { getHostel } from "../controller/hostel_controller.js";

const router = express.Router();

router.get("/", getHostel);

export default router;
