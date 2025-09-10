import express from "express";
import { getCollege } from "../controller/college_controller.js";

const router = express.Router();

router.get("/", getCollege);

export default router;
