const bookController = require('../controllers/BookController');
const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../middlewares/upload');
const router = require('express').Router();

router.post('/create', authenticateToken, upload, bookController.createBook);


module.exports = router; 
