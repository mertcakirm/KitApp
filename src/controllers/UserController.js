const UserRepository = require('../repositories/UserRepository');
const BookRepository = require('../repositories/BookRepository');
const UserService = require('../services/UserService');
const _context = require('../context/AppDbContext')

class UserController{
    constructor(userService){
        this.userService=userService;
    }

    getMyProfile = async (req,res,next) => {
        try {
            const {id} = req.user;
            const result = await this.userService.getMyProfile(id);
            return res.status(201).json(result);
        } catch (error) {
            next(error);     
        }
    };


    deleteMyProfile = async (req,res,next) => {
        try {
            const {id} = req.user;
            const result = await this.userService.deleteUser(id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);  
        }
    }

}


const userRepository = new UserRepository( _context );
const bookRepository = new BookRepository( _context );
const userService = new UserService( userRepository , bookRepository );

module.exports = new UserController( userService );
