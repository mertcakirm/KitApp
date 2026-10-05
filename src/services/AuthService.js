const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

class AuthService{

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  buildAuthResponse(user, roleName) {
    const normalizedRole = (roleName || '').toLowerCase();

    const userObject = {
      id: user.id,
      isAdmin: normalizedRole === 'admin',
      isUser: normalizedRole === 'user',
      isWriter: normalizedRole === 'writer',
    };

    const token = signToken({
      id: user.id,
      roleId: user.roleId,
      username: user.username,
      roleName: roleName
    });

    return { user: userObject, token };
  }

async register({ email, password, username }) {
  const existingUser = await this.userRepository.findForAuthByEmail(email);
  if (existingUser) {
    const error = new Error('Bu email adresi zaten kullanımda.');
    error.statusCode = 409;
    throw error;
  }

  const userRole = await this.userRepository.getRoleByName('User');
  if (!userRole) {
    const error = new Error('Varsayılan kullanıcı rolü (user) bulunamadı.');
    error.statusCode = 500;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await this.userRepository.create({
    email,
    password: hashedPassword,
    username,
    roleId: userRole.id
  });

  return this.buildAuthResponse(newUser, userRole.name);
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

  return this.buildAuthResponse(user, user.role.name);
}


  async changePassword(id, data) {
    const { oldPassword, newPassword } = data;

    if (!oldPassword || !newPassword) {
      const error = new Error('Eski şifre ve yeni şifre zorunludur.');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.userRepository.getById(id);
    if (!user) {
      const error = new Error('Kullanıcı bulunamadı.');
      error.statusCode = 404;
      throw error;
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('Eski şifre yanlış.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.changePassword(id, hashedPassword);

    return { message: 'Şifre başarıyla güncellendi.' };
  }


}


module.exports = AuthService;