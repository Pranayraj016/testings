import express from "express";
import { applyForVisit } from "../controller/visit_controller.js";

const router = express.Router();

router.post("/apply", applyForVisit);

export default router;
