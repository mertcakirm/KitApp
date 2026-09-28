const authController = require('../controllers/AuthController');
const { authenticateToken } = require('../middlewares/Authentication');
const router = require('express').Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router; 