import express from "express";
import { submitFeedback } from "../controller/Feedback_controller.js";

const router = express.Router();

// POST route for submitting feedback
router.post("/submit", submitFeedback);

export default router;
