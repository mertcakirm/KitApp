const BaseRepository = require('./BaseRepository');
const UserResponseDto = require('../DTOs/UserDTO');

class UserRepository extends BaseRepository {
  constructor() {
    super('Users');
  }

  async getAllUsers(pageNum = 1, limit = 10) {
    const page = Math.max(1, parseInt(pageNum, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const offset = (page - 1) * pageSize;

    const { count, rows } = await this.model.findAndCountAll({
      attributes: {
        exclude: ['password'] 
      },
      limit: pageSize,
      offset: offset,
      distinct: true
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      users: rows 
    };
  }


  async findForAuthByEmail(email) {
    return await this.model.findOne({
      where: { email },
      include: ['role']
    });
  }

  async changePassword(userId, newPassword) {
    const [affectedRows] = await this.model.update(
      { password: newPassword },
      { where: { id: userId } }
    );

    return affectedRows > 0;
  }

  async getMyInfo(userId) {
    const user = await this.model.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'username',
        'email',
        'bookCount',
        'roleId',
        'createdAt'
      ],
      include: [{ association: 'role', attributes: ['id', 'name'] }]
    });

    if (!user) {
      return null;
    }

    return new UserResponseDto(user);
  }

  async increaseBookCount(userId) {
    const user = await this.model.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı.');
    }
    
    user.bookCount += 1;
    await user.save();

    return user;
  }

  async decreaseBookCount(userId) {
    const user = await this.model.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    if (user.bookCount <= 0) {
      throw new Error('Kitap sayısı zaten sıfır.');
    }

    user.bookCount -= 1;
    await user.save();

    return user;
  }

  async deleteUser(userId) {
    const user = await this.model.findOne({ where: { id: userId } });

    if (!user) {
       throw new Error('Kullanıcı bulunamadı.');
    }
    
    user.isActive = false;
    await user.save();

    return { success: true, message: 'Kullanıcı başarıyla silindi!' };
  }
}

module.exports = UserRepository;
