const router = require('express').Router();
const Wishlist = require('../models/Wishlist');
const Internship = require('../models/Internship');
const { protect, studentOnly } = require('../middleware/auth');

// GET /api/wishlist - get student's wishlist
router.get('/', protect, studentOnly, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate({
        path: 'internshipId',
        populate: { path: 'professorId', select: 'name email iitName department' }
      })
      .sort({ createdAt: -1 });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/wishlist/:internshipId - add to wishlist
router.post('/:internshipId', protect, studentOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const existing = await Wishlist.findOne({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });

    res.status(201).json({
      message: 'Added to wishlist',
      wishlistItem
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist/:internshipId - remove from wishlist
router.delete('/:internshipId', protect, studentOnly, async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishlist/check/:internshipId - check if wishlisted
router.get('/check/:internshipId', protect, studentOnly, async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      userId: req.user.id,
      internshipId: req.params.internshipId
    });

    res.json({ isWishlisted: !!item });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;