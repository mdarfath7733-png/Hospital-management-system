const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../utils/idGenerator');

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide patient full name'],
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
    bloodGroup: {
      type: String,
      required: [true, 'Please specify blood group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    emergencyContactName: {
      type: String,
      required: [true, 'Please provide emergency contact name'],
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      required: [true, 'Please provide emergency contact phone'],
      trim: true,
    },
    patientType: {
      type: String,
      required: [true, 'Please specify patient type'],
      enum: ['Inpatient', 'Outpatient'],
      default: 'Inpatient',
    },
    admissionDate: {
      type: Date,
      required: [true, 'Please provide admission date'],
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Please assign a doctor'],
    },
    department: {
      type: String,
      required: [true, 'Please specify department'],
    },
    wardNumber: {
      type: String,
      trim: true,
      default: '',
    },
    roomNumber: {
      type: String,
      trim: true,
      default: '',
    },
    diagnosis: {
      type: String,
      required: [true, 'Please provide initial diagnosis'],
      trim: true,
    },
    symptoms: {
      type: String,
      trim: true,
      default: '',
    },
    medicalHistory: {
      type: String,
      trim: true,
      default: '',
    },
    allergies: {
      type: String,
      trim: true,
      default: '',
    },
    currentMedications: {
      type: String,
      trim: true,
      default: '',
    },
    insuranceProvider: {
      type: String,
      trim: true,
      default: '',
    },
    insurancePolicyNumber: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Admitted', 'Under Treatment', 'Discharged', 'Critical'],
      default: 'Admitted',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate patientId
patientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    this.patientId = await getNextSequenceValue('patientId', 'PAT-', 4);
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
