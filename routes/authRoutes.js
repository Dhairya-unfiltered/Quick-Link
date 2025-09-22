const express = require('express');
const router = express.Router();
const { showIndex, register, login, logout, dashboard } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/', showIndex);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user/dashboard', protect, dashboard);

module.exports = router;
