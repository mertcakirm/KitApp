const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authenticateToken } = require('../middlewares/Authentication');

router.get('/my-profile', authenticateToken, userController.getMyProfile);
router.get('/writers-all', userController.getAllWriters);
router.get('/writer/:id', userController.getWriterProfile);
router.delete('/delete-my-profile', authenticateToken, userController.deleteMyProfile);

module.exports = router; 