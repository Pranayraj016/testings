import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  id: Number,
  course: String,
  fee: String,
  details: String,
});

const reviewSchema = mongoose.Schema({
  id: Number,
  name: String,
  daysAgo: Number,
  rating: Number,
  review: String,
  likes: Number,
  comments: Number,
});

const collegeSchema = mongoose.Schema({
  id: Number,
  image: String,
  logo: String,
  name: String,
  placementrating: String,
  placementcompany: String,
  course: String,
  location: String,
  affiliation: String,
  rating: String,
  info1: String,
  info2: String,
  info3: String,
  info4: String,
  videolink: String,
  fees: String,
  rank: String,
  courses: [courseSchema],
  reviews: [reviewSchema],
  placementCompanys: [String],
});

const College = mongoose.model("College", collegeSchema);

export default College;
