const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const FacultyCode = require('../models/FacultyCode');

const codes = [
  'FAC001', 'FAC002', 'FAC003', 'FAC004', 'FAC005',
  'IIT001', 'IIT002', 'IIT003', 'IIT004', 'IIT005',
  'PROF01', 'PROF02', 'PROF03', 'PROF04', 'PROF05'
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected ✓');
    await FacultyCode.deleteMany({});
    const docs = codes.map(code => ({ code, isActive: true }));
    await FacultyCode.insertMany(docs);
    console.log('Faculty codes seeded ✓');
    console.log('Valid codes:', codes.join(', '));
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });