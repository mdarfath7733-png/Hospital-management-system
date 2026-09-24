const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  dischargePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { validatePatient } = require('../middleware/validators');

router
  .route('/')
  .get(protect, getPatients)
  .post(
    protect,
    roleCheck('admin', 'receptionist'),
    validatePatient,
    createPatient
  );

router.patch(
  '/:id/discharge',
  protect,
  roleCheck('admin', 'doctor', 'receptionist'),
  dischargePatient
);

router
  .route('/:id')
  .get(protect, getPatientById)
  .put(
    protect,
    roleCheck('admin', 'receptionist', 'doctor'),
    updatePatient
  )
  .delete(protect, roleCheck('admin'), deletePatient);

module.exports = router;
