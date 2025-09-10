import College from "../model/college_modal.js";

export const getCollege = async (req, res) => {
  try {
    const college = await College.find();
    res.status(200).json(college);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};
