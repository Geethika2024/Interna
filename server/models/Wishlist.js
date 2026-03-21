const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  }
}, { timestamps: true });

// One user can wishlist an internship only once
wishlistSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);