const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FacultyCode = require('../models/FacultyCode');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const isIITEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@iit[a-zA-Z0-9.]*\.ac\.in$/.test(email);
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, iitName, facultyCode } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!isIITEmail(email)) {
      return res.status(400).json({
        message: 'Only IIT email addresses are allowed (e.g. name@iitb.ac.in)'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (role === 'professor') {
      if (!facultyCode || !department || !iitName) {
        return res.status(400).json({
          message: 'Professors must provide department, IIT name, and faculty code'
        });
      }

      const codeDoc = await FacultyCode.findOne({
        code: facultyCode.toUpperCase(),
        isActive: true
      });

      if (!codeDoc) {
        return res.status(400).json({ message: 'Invalid or already used faculty code' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: department || '',
      iitName: iitName || '',
      facultyCode: facultyCode ? facultyCode.toUpperCase() : ''
    });

    if (role === 'professor') {
      await FacultyCode.findOneAndUpdate(
        { code: facultyCode.toUpperCase() },
        { isActive: false, usedBy: user._id }
      );
    }

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        iitName: user.iitName
      }
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        iitName: user.iitName
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;