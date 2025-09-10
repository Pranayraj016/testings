import Feedback from "../model/feedback_model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    // Validate required fields
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate rating (should be between 1 and 5)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Create and save new feedback
    const newFeedback = new Feedback({ name, email, rating, message });
    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully!",
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};
