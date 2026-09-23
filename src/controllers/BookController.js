const BookRepository = require('../repositories/BookRepository');
const UserRepository = require('../repositories/UserRepository');
const BookService = require('../services/BookService');
const _context = require('../context/AppDbContext');

class BookController{

    constructor( bookService ){
        this.bookService = bookService;
    }

    createBook = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { title, description } = req.body;

        if (!req.files || !req.files['pdf']) {
        return res.status(400).json({ 
            success: false, 
            message: 'Lütfen bir PDF dokümanı yükleyin.' 
        });
        }

        const pdfFile = req.files['pdf'][0];
        const filePath = `/uploads/pdfs/${pdfFile.filename}`;

        const coverFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;
        const coverImage = coverFile ? `/uploads/covers/${coverFile.filename}` : null;

        const bookData = {
        title,
        description,
        filePath,
        coverImage
        };

        const newBook = await this.bookService.createBook(id, bookData);

        return res.status(201).json({
        success: true,
        message: 'Kitap ve dökümanlar başarıyla yüklendi.',
        data: newBook
        });
    } catch (error) {
        next(error);
    }
    };


}




const bookRepository = new BookRepository(_context);
const userRepository = new UserRepository(_context);
const bookService = new BookService(userRepository, bookRepository);

module.exports = new BookController(bookService);