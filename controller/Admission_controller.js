import Admission from "../model/admission_model.js";

export const applyForAdmission = async (req, res) => {
  try {
    const {
      applyCollege,
      fullname,
      email,
      mobile,
      twelfthPass,
      twelfthPercentage,
      twelfthStream,
    } = req.body;

    const existingAdmission = await Admission.findOne({ email });
    if (existingAdmission) {
      return res
        .status(400)
        .json({ message: "You have already applied for admission." });
    }

    const newAdmission = new Admission({
      applyCollege,
      fullname,
      email,
      mobile,
      twelfthPass,
      twelfthPercentage,
      twelfthStream,
    });

    await newAdmission.save();
    res.status(201).json({
      message: "Admission application submitted successfully!",
      data: newAdmission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting admission",
      error: error.message,
    });
  }
};
