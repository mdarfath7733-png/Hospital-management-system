const Staff = require('../models/Staff');
const Patient = require('../models/Patient');

// @desc    Get dashboard statistics & analytics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    // Basic counts
    const [
      totalStaff,
      totalPatients,
      admitted,
      discharged,
      critical,
      underTreatment,
      doctorsCount,
    ] = await Promise.all([
      Staff.countDocuments(),
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'Admitted' }),
      Patient.countDocuments({ status: 'Discharged' }),
      Patient.countDocuments({ status: 'Critical' }),
      Patient.countDocuments({ status: 'Under Treatment' }),
      Staff.countDocuments({ role: 'Doctor' }),
    ]);

    // Patients aggregated by department for Recharts BarChart
    const patientsByDepartment = await Patient.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Patient status distribution for Recharts PieChart
    const patientStatusDistribution = [
      { status: 'Admitted', count: admitted },
      { status: 'Under Treatment', count: underTreatment },
      { status: 'Discharged', count: discharged },
      { status: 'Critical', count: critical },
    ].filter((item) => item.count > 0);

    // Recent Admissions (latest 5 patients with assigned doctor)
    const recentAdmissions = await Patient.find()
      .populate('assignedDoctor', 'staffId fullName department specialization')
      .sort({ admissionDate: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStaff,
        totalPatients,
        admitted,
        discharged,
        critical,
        underTreatment,
        doctorsCount,
        patientsByDepartment,
        patientStatusDistribution,
        recentAdmissions,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
};
