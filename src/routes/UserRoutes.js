const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authenticateToken } = require('../middlewares/Authentication');

router.get('/my-profile', authenticateToken, userController.getMyProfile);


module.exports = router; 