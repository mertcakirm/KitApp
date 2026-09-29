const UserRepository = require('../repositories/UserRepository');
const BookRepository = require('../repositories/BookRepository');
const AdminService = require('../services/AdminService');
const _context = require('../context/AppDbContext');

class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }

   getAllUsers = async (req,res,next) => {
        try {
            const { page = 1, limit = 10,search } = req.query;
            const result = await this.adminService.getAllUsers(page,limit,search);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    getAllBooks = async (req,res,next) => {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const result = await this.adminService.getAllBooks(page,limit,search);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }


    deleteUser = async (req,res,next) => {
        try {
            const {id} = req.params;
            const result = await this.userService.deleteUser(id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);  
        }
    }

    deleteBook = async (req,res,next) => {
        try {
            const {id} = req.params;
            const result = await this.adminService.deleteBook(id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);  
        }
    }

    verifyBook = async (req,res,next) => {
        try {
            const {bookId} = req.params;
            const result = await this.adminService.verifyBook(bookId);
            return res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

    unverifyBook = async (req,res,next) => {
        try {
            const {bookId} = req.params;
            const result = await this.adminService.unverifyBook(bookId);
            return res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

}


const userRepository = new UserRepository( _context );
const bookRepository = new BookRepository( _context );
const adminService = new AdminService( userRepository,bookRepository );

module.exports = new AdminController( adminService );
