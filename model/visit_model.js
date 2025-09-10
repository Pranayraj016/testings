import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  applyTo: { type: String, required: true, trim: true },
  nearCollegeName: { type: String, required: true, trim: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true, trim: true },
  requiredFor: { type: String, required: true, trim: true },
  bedRequirement: { type: String, required: true, trim: true },
  budget: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
});

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
