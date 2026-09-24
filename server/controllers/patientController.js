const Patient = require('../models/Patient');
const Staff = require('../models/Staff');

// @desc    Get all patients with search, filters, pagination
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res, next) => {
  try {
    const { search, status, department, doctor, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by fullName, patientId, phone, diagnosis
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;
    if (department) query.department = department;
    if (doctor) query.assignedDoctor = doctor;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .populate('assignedDoctor', 'staffId fullName department specialization phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: patients,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'assignedDoctor',
      'staffId fullName department specialization qualification phone email'
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private (Admin, Receptionist)
const createPatient = async (req, res, next) => {
  try {
    // Verify assigned doctor exists and is indeed a Doctor
    if (req.body.assignedDoctor) {
      const doctor = await Staff.findById(req.body.assignedDoctor);
      if (!doctor || doctor.role !== 'Doctor') {
        return res.status(400).json({
          success: false,
          message: 'The selected assigned staff must be a valid Doctor',
        });
      }
    }

    const patient = await Patient.create(req.body);
    const populated = await Patient.findById(patient._id).populate(
      'assignedDoctor',
      'staffId fullName department specialization'
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Admin, Receptionist, Doctor)
const updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id: ${req.params.id}`,
      });
    }

    // Role check: Doctor can only update diagnosis, symptoms, medications, medicalHistory, allergies, status
    if (req.user.role === 'doctor') {
      const allowedFields = [
        'diagnosis',
        'symptoms',
        'medicalHistory',
        'allergies',
        'currentMedications',
        'status',
        'dischargeDate',
      ];
      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).populate('assignedDoctor', 'staffId fullName department specialization');

      return res.status(200).json({
        success: true,
        message: 'Patient clinical details updated successfully',
        data: patient,
      });
    }

    // Admin & Receptionist
    if (req.body.assignedDoctor) {
      const doctor = await Staff.findById(req.body.assignedDoctor);
      if (!doctor || doctor.role !== 'Doctor') {
        return res.status(400).json({
          success: false,
          message: 'The selected assigned staff must be a valid Doctor',
        });
      }
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedDoctor', 'staffId fullName department specialization');

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Discharge patient
// @route   PATCH /api/patients/:id/discharge
// @access  Private (Admin, Doctor, Receptionist)
const dischargePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id: ${req.params.id}`,
      });
    }

    if (patient.status === 'Discharged') {
      return res.status(400).json({
        success: false,
        message: 'Patient is already marked as Discharged',
      });
    }

    patient.status = 'Discharged';
    patient.dischargeDate = new Date();
    await patient.save();

    const populated = await Patient.findById(patient._id).populate(
      'assignedDoctor',
      'staffId fullName department specialization'
    );

    res.status(200).json({
      success: true,
      message: 'Patient has been successfully discharged',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id: ${req.params.id}`,
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Patient record deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  dischargePatient,
  deletePatient,
};
