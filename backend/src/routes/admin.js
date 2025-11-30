// backend/src/routes/admin.js
const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const User = require('../models/User');
const Suggestion = require('../models/Suggestion');
const ProjectSubmission = require('../models/ProjectSubmission');
const upload = require("../middleware/upload");

const router = express.Router();

router.use(auth);
router.use(requireAdmin);

router.get('/users', async (req, res) => {
  try {
    const users = await User.aggregate([
      { $sort: { created_at: -1 } },
      { $project: { name: 1, email: 1, role: 1, created_at: 1 } },
      {
        $lookup: {
          from: 'suggestions',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
            { $count: 'count' },
          ],
          as: 'suggestionCountArr',
        },
      },
      {
        $lookup: {
          from: 'projectsubmissions',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
            { $count: 'count' },
          ],
          as: 'submissionCountArr',
        },
      },
      {
        $addFields: {
          suggestionCount: { $ifNull: [{ $arrayElemAt: ['$suggestionCountArr.count', 0] }, 0] },
          submissionCount: { $ifNull: [{ $arrayElemAt: ['$submissionCountArr.count', 0] }, 0] },
        },
      },
      { $project: { suggestionCount: 1, submissionCount: 1, name: 1, email: 1, role: 1, created_at: 1 } },
    ]);

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


router.patch(
  "/submissions/:id/review",
  upload.single("badgeFile"),
  async (req, res) => {
    try {
      const { rating, comments, completionPercent } = req.body;

      const submission = await ProjectSubmission.findById(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const numericRating = Number(rating) || 0;
      const numericCompletion =
        Number(completionPercent) >= 0 && Number(completionPercent) <= 100
          ? Number(completionPercent)
          : undefined;

      let badgeFileUrl = submission.adminReview?.badgeFileUrl;

      if (req.file) {
        badgeFileUrl = `${process.env.BASE_URL}/uploads/badges/${req.file.filename}`;
      }

      submission.adminReview = {
        ...(submission.adminReview || {}),
        rating: numericRating,
        comments: comments || "",
        completionPercent: numericCompletion,
        badgeFileUrl,
        reviewedAt: new Date(),
        reviewedBy: req.user.userId,
      };

      await submission.save();

      res.json({ message: "Review saved", submission });
    } catch (err) {
      console.error("Error reviewing submission:", err);
      res.status(500).json({ message: "Failed to review submission" });
    }
  }
);



router.get('/users/:id/summary', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const suggestions = await Suggestion.find({ userId }).sort({ createdAt: -1 }).lean();

    const submissions = await ProjectSubmission.find({ userId })
      .populate('suggestionId')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      suggestions,
      submissions,
    });
  } catch (err) {
    console.error('Admin user summary error:', err);
    res.status(500).json({ message: 'Failed to load user details' });
  }
});

module.exports = router;


