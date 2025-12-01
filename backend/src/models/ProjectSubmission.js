// backend/src/models/ProjectSubmission.js
const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    suggestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion', required: true },
    githubLink: { type: String, required: true },
    frontendUrl: { type: String },
    backendUrl: { type: String },
    videoUrl: { type: String },
    adminReview: {
      rating: { type: Number, min: 1, max: 5 },
      badge: { type: String },
      comments: { type: String },
      completionPercent: { type: Number, min: 0, max: 100 },
      badgeFileUrl: { type: String },
      reviewedAt: { type: Date },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('ProjectSubmission', projectSubmissionSchema);
