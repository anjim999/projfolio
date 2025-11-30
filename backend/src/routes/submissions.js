// backend/src/routes/submissions.js
const express = require('express');
const auth = require('../middleware/auth');
const Suggestion = require('../models/Suggestion');
const ProjectSubmission = require('../models/ProjectSubmission');

const router = express.Router();
router.use(auth);

// POST /api/submissions
router.post('/', async (req, res) => {
  try {
    const { suggestionId, githubLink, frontendUrl, backendUrl, videoUrl } = req.body;

    const suggestion = await Suggestion.findOne({
      _id: suggestionId,
      userId: req.user.userId,
    });

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    const submission = await ProjectSubmission.create({
      userId: req.user.userId,
      suggestionId,
      githubLink,
      frontendUrl,
      backendUrl,
      videoUrl,
    });

    suggestion.status = 'completed';
    await suggestion.save();

    res.json({
      message: 'Project submitted successfully',
      submission,
    });
  } catch (err) {
    console.error('Error in POST /api/submissions:', err);
    res.status(500).json({ message: 'Failed to submit project' });
  }
});

// GET /api/submissions/my
router.get('/my', async (req, res) => {
  try {
    const submissions = await ProjectSubmission.find({
      userId: req.user.userId,
    })
      .populate('suggestionId')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error('Error in GET /api/submissions/my:', err);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

module.exports = router;
