// backend/src/routes/suggestions.js
const express = require("express");
const auth = require("../middleware/auth");
const Suggestion = require("../models/Suggestion");
const { generateProjectSuggestions } = require("../services/aiService");

const router = express.Router();

router.use(auth);


router.post("/generate", async (req, res) => {
  try {
    const { skills, level, interests, techStack, duration, goal } = req.body;

    const suggestions = await generateProjectSuggestions({
      skills,
      level,
      interests,
      techStack,
      duration,
      goal,
    });

    return res.json({
      message: "Suggestions generated successfully",
      suggestions,
    });
  } catch (err) {
    console.error("Generate suggestions error:", err);
    res.status(500).json({ message: err});
  }
});


router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      description,
      techStack,
      features,
      learningOutcomes,
      duration,
      level,
      tools,
      setupInstructions,
      status,
    } = req.body;

    const suggestion = new Suggestion({
      userId,
      title,
      description,
      techStack: techStack || [],
      features: features || [],
      learningOutcomes: learningOutcomes || [],
      duration: duration || "",
      level: level || "Intermediate",
      tools: tools || [],
      setupInstructions: setupInstructions || "",
      status: status || "generated",
    });

    const saved = await suggestion.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving suggestion:", err);
    res.status(500).json({ message: "Failed to save suggestion" });
  }
});


router.get("/my", async (req, res) => {
  try {
    const userId = req.user.userId;
    const list = await Suggestion.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching mySuggestions:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});


router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["generated", "in-progress", "completed"];

    const newStatus = status || "in-progress";
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const suggestion = await Suggestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: newStatus },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.json({ message: "Status updated", suggestion });
  } catch (err) {
    console.error("Error in /api/suggestions/:id/status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
