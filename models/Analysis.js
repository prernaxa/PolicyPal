// models/Analysis.js
import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  source: { type: String, enum: ['text', 'pdf', 'url'], required: true },
  input: { type: String },
  summary: { type: String },
  risks: [String],
  trustScore: Number,
  categories: { type: Map, of: Boolean },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
