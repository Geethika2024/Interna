const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['immediate', 'later'],
    required: true
  },
  availabilityDetails: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Accepted', 'Rejected'],
    default: 'Applied'
  }
}, { timestamps: true });

// One student can only apply once per internship
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);