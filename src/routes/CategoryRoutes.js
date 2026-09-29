const router = require('express').Router();
const categoryController = require('../controllers/CategoryController');
const { authenticateToken, requireRole } = require('../middlewares/Authentication');

router.get('/all', categoryController.getAll);
router.post('/create', authenticateToken , requireRole('admin') , categoryController.create);
router.delete('/delete/:id' , authenticateToken , requireRole('admin') , categoryController.delete);


module.exports = router; 