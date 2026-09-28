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
        let { categoryIds } = req.body;

        if (typeof categoryIds === 'string') {
            try {
                categoryIds = JSON.parse(categoryIds);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'categoryIds geçerli bir JSON dizisi olmalıdır.'
                });
            }
        }

        if (categoryIds === undefined) categoryIds = [];
        if (!Array.isArray(categoryIds)) {
            return res.status(400).json({
                success: false,
                message: 'categoryIds bir dizi olmalıdır.'
            });
        }

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

        const newBook = await this.bookService.createBook(id, bookData, categoryIds);

        return res.status(201).json({
        success: true,
        message: 'Kitap ve dökümanlar başarıyla yüklendi.',
        data: newBook
        });
    } catch (error) {
        next(error);
    }
    };


    getAllBooks = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const result = await this.bookService.getAllBooks(page, limit);

            return res.status(200).json({
                success: true,
                ...result // Servisten gelen totalItems, totalPages, currentPage ve books verilerini yayıyoruz
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Kitaplar listelenirken bir hata oluştu.',
                error: error.message
            });
        }
    }

    deleteBook = async (req, res, next) => {
        try {
            const userId = req.user.id; 
            const { bookId } = req.params;

            const result = await this.bookService.deleteBook(userId, bookId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    bookId: result.bookId
                }
            });
        } catch (error) {
            next(error);
        }
    }

    updateBook = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { bookId } = req.params;
            const { title, description } = req.body;

            let coverImage = undefined;
            if (req.files && req.files['coverImage']) {
                const coverFile = req.files['coverImage'][0];
                coverImage = `/uploads/covers/${coverFile.filename}`;
            }

            const result = await this.bookService.updateBook(
                userId, 
                bookId, 
                title, 
                description, 
                coverImage
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.book
            });
        } catch (error) {
            next(error);
        }
    }

}


const bookRepository = new BookRepository(_context);
const userRepository = new UserRepository(_context);
const bookService = new BookService(userRepository, bookRepository);

module.exports = new BookController(bookService);
