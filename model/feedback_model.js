import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true }, // Changed to Number
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Corrected model export
const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default Feedback;
