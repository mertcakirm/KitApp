const _context = require('../context/AppDbContext');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { email, password, username } = req.body;
      const result = await this.authService.register({ email, password, username });
      
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

    changePassword = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword } = req.body;
      const result = await this.authService.changePassword(id, { oldPassword, newPassword });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };


}

const userRepository = new UserRepository(_context);
const authService = new AuthService(userRepository);

module.exports = new AuthController(authService);
