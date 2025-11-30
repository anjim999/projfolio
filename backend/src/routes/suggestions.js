// backend/src/routes/suggestions.js
const express = require('express');
const auth = require('../middleware/auth');
const Suggestion = require('../models/Suggestion');
const { generateProjectSuggestions } = require('../services/aiService');

const router = express.Router();

// All routes require auth
router.use(auth);

// POST /api/suggestions/generate
router.post('/generate', async (req, res) => {
  try {
    const { skills, interests, techStack, duration, goal } = req.body;

    const suggestionsData = await generateProjectSuggestions({
      skills,
      interests,
      techStack,
      duration,
      goal,
    });

    const created = await Suggestion.insertMany(
      suggestionsData.map((s) => ({
        userId: req.user.userId,
        title: s.title,
        description: s.description,
        techStack: s.techStack || [],
        setupInstructions: s.setupInstructions || '',
        features: s.features || [],
        learningOutcomes: s.learningOutcomes || [],
        duration: s.duration || duration || '',
        goal: goal || '',
        status: 'generated',
      }))
    );

    res.json({
      message: 'Suggestions generated successfully',
      suggestions: created,
    });
  } catch (err) {
    console.error('Error in /api/suggestions/generate:', err);
    res.status(500).json({ message: 'Failed to generate suggestions' });
  }
});

// GET /api/suggestions/my
router.get('/my', async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(suggestions);
  } catch (err) {
    console.error('Error in /api/suggestions/my:', err);
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

// PATCH /api/suggestions/:id/status -> set in-progress / completed
router.patch('/:id/start', async (req, res) => {
  try {
    const suggestion = await Suggestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: 'in-progress' },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    res.json({ message: 'Status updated', suggestion });
  } catch (err) {
    console.error('Error in /api/suggestions/:id/start:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// PATCH /api/suggestions/:id/status -> update status (default to 'in-progress')
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['generated', 'in-progress', 'completed'];

    const newStatus = status || 'in-progress';
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const suggestion = await Suggestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: newStatus },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    res.json({ message: 'Status updated', suggestion });
  } catch (err) {
    console.error('Error in /api/suggestions/:id/status:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});


module.exports = router;
