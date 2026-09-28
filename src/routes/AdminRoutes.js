const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const router = require('express').Router();
const adminController = require("../controllers/AdminController")

router.get('/all-users', authenticateToken, requireRole("admin") ,adminController.getAllUsers);
router.get('/all-books', authenticateToken, requireRole("admin") ,adminController.getAllBooks);
router.delete('/delete-user', authenticateToken, requireRole("admin") ,adminController.deleteUser);
router.delete('/delete-book', authenticateToken, requireRole("admin") ,adminController.deleteBook);

module.exports = router; 