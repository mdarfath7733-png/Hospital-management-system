const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { validateLogin, validateRegister } = require('../middleware/validators');

router.post('/login', validateLogin, login);
router.post('/register', protect, roleCheck('admin'), validateRegister, register);
router.get('/me', protect, getMe);

module.exports = router;
