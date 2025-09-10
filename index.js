import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import collegeRoute from "./route/college_route.js";
import hostelRoute from "./route/hostel_route.js";
import userRoute from "./route/user_route.js";
import admissionRoute from "./route/admission_route.js";
import visitRoute from "./route/visit_route.js";
import otpRoute from "./route/user_route.js";
import feebackRoute from "./route/feedback_route.js";
import authRouter from "./route/authRoute.js";
import usersRouter from "./route/usersRoutes.js";

const allowedOrigins = ["http://localhost:5173"];

dotenv.config();

const app = express();

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

app.use("/college", collegeRoute);
app.use("/hostel", hostelRoute);
app.use("/user", userRoute);
app.use("/admission", admissionRoute);
app.use("/visit", visitRoute);
app.use("/otp", otpRoute);
app.use("/feedback", feebackRoute);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
