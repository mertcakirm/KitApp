const bookController = require('../controllers/BookController');
const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../middlewares/upload');
const router = require('express').Router();

router.post('/create', authenticateToken, upload, bookController.createBook);
router.get('/all', bookController.getAllBooks);
router.delete('/delete/:bookId', authenticateToken, bookController.deleteBook);

module.exports = router; 