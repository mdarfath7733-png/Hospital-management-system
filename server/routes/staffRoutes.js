const express = require('express');
const router = express.Router();
const {
  getStaff,
  getDoctors,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { validateStaff } = require('../middleware/validators');

// Specific route must be before /:id parameter route
router.get('/doctors', protect, getDoctors);

router
  .route('/')
  .get(protect, getStaff)
  .post(protect, roleCheck('admin'), validateStaff, createStaff);

router
  .route('/:id')
  .get(protect, getStaffById)
  .put(protect, roleCheck('admin'), validateStaff, updateStaff)
  .delete(protect, roleCheck('admin'), deleteStaff);

module.exports = router;
