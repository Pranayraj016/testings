import Hostel from "../model/hostel_model.js";

export const getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.find();
    res.status(200).json(hostel);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};
