const router = require('express').Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { protect, professorOnly, studentOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /api/applications/apply - student applies to internship
router.post('/apply', protect, studentOnly, upload.single('resume'), async (req, res) => {
  try {
    const { internshipId, availabilityStatus, availabilityDetails } = req.body;

    if (!internshipId || !availabilityStatus) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }

    // Check internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check deadline
    if (new Date() > new Date(internship.deadline)) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check already applied
    const existing = await Application.findOne({
      studentId: req.user.id,
      internshipId
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this internship' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const application = await Application.create({
      studentId: req.user.id,
      internshipId,
      resumeUrl,
      availabilityStatus,
      availabilityDetails: availabilityDetails || ''
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this internship' });
    }
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/my - student sees their own applications
router.get('/my', protect, studentOnly, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'internshipId',
        populate: { path: 'professorId', select: 'name email iitName department' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/internship/:internshipId - professor sees applicants
router.get('/internship/:internshipId', protect, professorOnly, async (req, res) => {
  try {
    // Make sure this internship belongs to this professor
    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.professorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ internshipId: req.params.internshipId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/applications/:id/status - professor updates application status
router.put('/:id/status', protect, professorOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Applied', 'In Review', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id)
      .populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Make sure professor owns this internship
    if (application.internshipId.professorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json({
      message: `Application marked as ${status}`,
      application
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/professor/all - professor sees all their applications
router.get('/professor/all', protect, professorOnly, async (req, res) => {
  try {
    // Get all internships by this professor
    const internships = await Internship.find({ professorId: req.user.id });
    const internshipIds = internships.map(i => i._id);

    const applications = await Application.find({ internshipId: { $in: internshipIds } })
      .populate('studentId', 'name email')
      .populate('internshipId', 'title iitName mode deadline')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;