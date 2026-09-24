const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../utils/idGenerator');

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Please specify gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth'],
    },
    role: {
      type: String,
      required: [true, 'Please specify role'],
      enum: [
        'Doctor',
        'Nurse',
        'Receptionist',
        'Lab Technician',
        'Pharmacist',
        'Admin',
        'Other',
      ],
    },
    department: {
      type: String,
      required: [true, 'Please specify department'],
      enum: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'General Medicine',
        'Surgery',
        'Emergency',
        'Radiology',
        'Other',
      ],
    },
    specialization: {
      type: String,
      trim: true,
      default: '',
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualifications'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Please specify joining date'],
      default: Date.now,
    },
    shift: {
      type: String,
      required: [true, 'Please specify work shift'],
      enum: ['Morning', 'Evening', 'Night'],
      default: 'Morning',
    },
    salary: {
      type: Number,
      required: [true, 'Please specify salary'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Resigned'],
      default: 'Active',
    },
    photoUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate staffId if not present
staffSchema.pre('save', async function (next) {
  if (!this.staffId) {
    this.staffId = await getNextSequenceValue('staffId', 'STF-', 4);
  }
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
