const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

class AuthService{

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ email, password, username }) {
    const existingUser = await this.userRepository.findForAuthByEmail(email);
    if (existingUser) {
      const error = new Error('Bu email adresi zaten kullanımda.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      roleId:"123987"
    });

    const token = signToken({
      id: newUser.id,
      role: newUser.role?.name,
    });

    const User = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      roleId: newUser.roleId,
    };

    return { user: User, token };
  }


  async login({ email, password }) {
    const user = await this.userRepository.findForAuthByEmail(email);
    if (!user) {
      const error = new Error('Geçersiz email veya şifre.');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Geçersiz email veya şifre.');
      error.statusCode = 401;
      throw error;
    }

    const userObject = {
      id: user.id,
      isAdmin: user.role.name === 'admin',
      isUser: user.role.name === 'user',
      isWriter: user.role.name === 'writer',
    }

    const token = signToken({
      id: user.id,
      roleId: user.roleId,
      username: user.username,
      roleName:user.role.name
      
    });

    return { user: userObject, token };
  }
}


module.exports = AuthService;