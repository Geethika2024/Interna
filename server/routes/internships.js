const router = require('express').Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const { protect, professorOnly, studentOnly } = require('../middleware/auth');

// GET /api/internships - get all internships with filters
router.get('/', protect, async (req, res) => {
  try {
    const {
      search, iitName, domain, mode,
      minStipend, maxStipend, duration, skills
    } = req.query;

    let filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }
    if (iitName)    filter.iitName = { $regex: iitName, $options: 'i' };
    if (domain)     filter.domain  = { $regex: domain,  $options: 'i' };
    if (mode)       filter.mode    = mode;
    if (duration)   filter.duration = { $regex: duration, $options: 'i' };
    if (minStipend) filter.stipend = { ...filter.stipend, $gte: Number(minStipend) };
    if (maxStipend) filter.stipend = { ...filter.stipend, $lte: Number(maxStipend) };
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillArray.map(s => new RegExp(s, 'i')) };
    }

    const internships = await Internship.find(filter)
      .populate('professorId', 'name email department iitName')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/internships/:id - get single internship
router.get('/:id', protect, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('professorId', 'name email department iitName');

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/internships - create internship (professor only)
router.post('/', protect, professorOnly, async (req, res) => {
  try {
    const {
      title, description, skills, domain,
      duration, stipend, positions,
      iitName, mode, deadline
    } = req.body;

    if (!title || !description || !domain || !duration || !iitName || !mode || !deadline) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const internship = await Internship.create({
      title,
      description,
      skills: skills || [],
      domain,
      duration,
      stipend: stipend || 0,
      positions: positions || 1,
      iitName,
      mode,
      deadline: new Date(deadline),
      professorId: req.user.id
    });

    const populated = await internship.populate('professorId', 'name email department iitName');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/internships/:id - edit internship (professor only, own internship)
router.put('/:id', protect, professorOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.professorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this internship' });
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('professorId', 'name email department iitName');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/internships/:id - delete internship (professor only, own internship)
router.delete('/:id', protect, professorOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.professorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this internship' });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/internships/professor/my - get professor's own internships
router.get('/professor/my', protect, professorOnly, async (req, res) => {
  try {
    const internships = await Internship.find({ professorId: req.user.id })
      .sort({ createdAt: -1 });

    // Get applicant count for each
    const internshipsWithCount = await Promise.all(
      internships.map(async (internship) => {
        const count = await Application.countDocuments({ internshipId: internship._id });
        return { ...internship.toObject(), applicantCount: count };
      })
    );

    res.json(internshipsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;