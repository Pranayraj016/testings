import mongoose from "mongoose";

const hostelSchema = mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  ac: String,
  ratings: String,
  distance: String,
  basePrice: Number,
  luxury: String,
  gender: String,
  facilities: [String],
  prices: {
    "Single Bed": Number,
    "Double Bed": Number,
    "Triple Bed": Number,
  },
});

const Hostel = mongoose.model("Hostel", hostelSchema);

export default Hostel;
