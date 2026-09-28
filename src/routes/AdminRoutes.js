const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const router = require('express').Router();
const adminController = require("../controllers/AdminController")

router.get('/all-users', authenticateToken, requireRole("admin") ,adminController.getAllUsers);
router.get('/all-books', authenticateToken, requireRole("admin") ,adminController.getAllBooks);
router.delete('/delete-user/:id', authenticateToken, requireRole("admin") ,adminController.deleteUser);
router.delete('/delete-book/:id', authenticateToken, requireRole("admin") ,adminController.deleteBook);
router.put('/verify-book/:bookId', authenticateToken, requireRole("admin") ,adminController.verifyBook);
router.put('/unverify-book/:bookId', authenticateToken, requireRole("admin") ,adminController.unverifyBook);

module.exports = router; 