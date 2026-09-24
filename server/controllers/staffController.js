const Staff = require('../models/Staff');

// @desc    Get all staff with search, filters, pagination
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res, next) => {
  try {
    const { search, role, department, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Text search on fullName, staffId, email, phone, specialization
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { staffId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Staff.countDocuments(query);
    const staffMembers = await Staff.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: staffMembers.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: staffMembers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get only doctors (for patient assignment dropdown)
// @route   GET /api/staff/doctors
// @access  Private
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Staff.find({
      role: 'Doctor',
      status: { $ne: 'Resigned' },
    })
      .select('staffId fullName department specialization qualification status')
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: `Staff member not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = async (req, res, next) => {
  try {
    // Check if email already in use by staff
    const existingStaff = await Staff.findOne({ email: req.body.email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'A staff member with this email already exists',
      });
    }

    const staff = await Staff.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res, next) => {
  try {
    let staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: `Staff member not found with id: ${req.params.id}`,
      });
    }

    // Check email uniqueness if email is changed
    if (req.body.email && req.body.email !== staff.email) {
      const existingEmail = await Staff.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another staff member',
        });
      }
    }

    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: `Staff member not found with id: ${req.params.id}`,
      });
    }

    await Staff.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Staff member deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStaff,
  getDoctors,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
