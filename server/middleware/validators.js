const { body, validationResult } = require('express-validator');

// Handler to check validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: errorDetails[0].message,
      errors: errorDetails,
    });
  }
  next();
};

// Auth Validations
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'doctor', 'receptionist'])
    .withMessage('Role must be admin, doctor, or receptionist'),
  validate,
];

// Staff Validations
const validateStaff = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Valid date of birth is required'),
  body('role')
    .isIn([
      'Doctor',
      'Nurse',
      'Receptionist',
      'Lab Technician',
      'Pharmacist',
      'Admin',
      'Other',
    ])
    .withMessage('Valid staff role is required'),
  body('department')
    .isIn([
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'General Medicine',
      'Surgery',
      'Emergency',
      'Radiology',
      'Other',
    ])
    .withMessage('Valid department is required'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('shift')
    .isIn(['Morning', 'Evening', 'Night'])
    .withMessage('Shift must be Morning, Evening, or Night'),
  body('salary')
    .isNumeric()
    .withMessage('Salary must be a positive number')
    .custom((val) => val >= 0)
    .withMessage('Salary cannot be negative'),
  body('status')
    .optional()
    .isIn(['Active', 'On Leave', 'Resigned'])
    .withMessage('Status must be Active, On Leave, or Resigned'),
  validate,
];

// Patient Validations
const validatePatient = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Valid date of birth is required'),
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Valid blood group is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('emergencyContactName')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact name is required'),
  body('emergencyContactPhone')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact phone is required'),
  body('patientType')
    .isIn(['Inpatient', 'Outpatient'])
    .withMessage('Patient type must be Inpatient or Outpatient'),
  body('assignedDoctor')
    .isMongoId()
    .withMessage('Valid assigned doctor ID is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('status')
    .optional()
    .isIn(['Admitted', 'Under Treatment', 'Discharged', 'Critical'])
    .withMessage('Status must be Admitted, Under Treatment, Discharged, or Critical'),
  validate,
];

module.exports = {
  validateLogin,
  validateRegister,
  validateStaff,
  validatePatient,
};
