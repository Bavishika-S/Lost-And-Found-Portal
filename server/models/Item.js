const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    contactDetails: { type: String, required: true },
    image: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'matched', 'returned'], default: 'pending' },
    type: { type: String, enum: ['lost', 'found'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);


