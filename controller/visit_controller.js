import Visit from "../model/visit_model.js";

export const applyForVisit = async (req, res) => {
  try {
    const {
      applyTo,
      nearCollegeName,
      fullName,
      email,
      mobile,
      requiredFor,
      bedRequirement,
      budget,
      date,
    } = req.body;

    const newVisit = new Visit({
      applyTo,
      nearCollegeName,
      fullName,
      email,
      mobile,
      requiredFor,
      bedRequirement,
      budget,
      date,
    });

    await newVisit.save();
    res.status(201).json({
      message: "Visit application submitted successfully",
      data: newVisit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting visit",
      error: error.message,
    });
  }
};
