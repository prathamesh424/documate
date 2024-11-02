// lib/Highlight.js
import mongoose from 'mongoose';

const HighlightSchema = new mongoose.Schema({
    title: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    website: String,
});

const Highlight = mongoose.models.Highlight || mongoose.model('Highlight', HighlightSchema);

export default Highlight;
