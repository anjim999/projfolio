// backend/src/models/Suggestion.js
const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    setupInstructions: { type: String },
    features: [{ type: String }],
    learningOutcomes: [{ type: String }],
    duration: { type: String },
    goal: { type: String },
    status: {
      type: String,
      enum: ['generated', 'in-progress', 'completed'],
      default: 'generated',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Suggestion', suggestionSchema);
