import express from "express";
import { applyForAdmission } from "../controller/Admission_controller.js";

const router = express.Router();

router.post("/apply", applyForAdmission);

export default router;
