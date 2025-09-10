import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  applyCollege: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  twelfthPass: { type: Boolean, required: true },
  twelfthPercentage: { type: String, required: true },
  twelfthStream: { type: String, required: true },
});

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
