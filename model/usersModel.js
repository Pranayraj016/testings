import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyotp: { type: String, default: "" },
  verifyotpExpireAt: { type: String, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetotp: { type: String, default: "" },
  resetotpExpireAt: { type: Number, default: 0 },
});

const UserModel = mongoose.models.user || mongoose.model("users", UsersSchema);
export default UserModel;
