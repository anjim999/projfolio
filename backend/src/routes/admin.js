// backend/src/routes/admin.js
const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const User = require('../models/User');
const Suggestion = require('../models/Suggestion');
const ProjectSubmission = require('../models/ProjectSubmission');

const router = express.Router();

router.use(auth);
router.use(requireAdmin);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role created_at').sort({
      created_at: -1,
    });
    res.json(users);
  } catch (err) {
    console.error('Admin users query error:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin accounts' });
    }

    await User.findByIdAndDelete(userId);
    await Suggestion.deleteMany({ userId });
    await ProjectSubmission.deleteMany({ userId });

    res.json({ message: 'User deleted successfully', deletedId: userId });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await ProjectSubmission.find()
      .populate('userId', 'name email')
      .populate('suggestionId')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

// PATCH /api/admin/submissions/:id/review
router.patch('/submissions/:id/review', async (req, res) => {
  try {
    const { rating, badge, comments } = req.body;

    const submission = await ProjectSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.adminReview = {
      rating,
      badge,
      comments,
      reviewedAt: new Date(),
      reviewedBy: req.user.userId,
    };

    await submission.save();

    res.json({ message: 'Review saved', submission });
  } catch (err) {
    console.error('Error reviewing submission:', err);
    res.status(500).json({ message: 'Failed to review submission' });
  }
});

module.exports = router;
