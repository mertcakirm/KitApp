const { Op } = require('sequelize');
const BaseRepository = require('./BaseRepository');
const UserResponseDto = require('../DTOs/UserDTO');

class UserRepository extends BaseRepository {
  constructor() {
    super('Users');
  }

  async getAllUsers(pageNum = 1, limit = 10, search = '') {
    const page = Math.max(1, parseInt(pageNum, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const offset = (page - 1) * pageSize;

    const whereCondition = search ? {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await this.model.findAndCountAll({
      where: whereCondition,
      attributes: {
        exclude: ['password'] 
      },
      include: [
        {
          association: 'role',  
          attributes: ['name']
        }
      ],
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

  async getWriters(pageNum = 1, limit = 10, search = '') {
    const page = Math.max(1, parseInt(pageNum, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const offset = (page - 1) * pageSize;

    const whereCondition = {
      isActive: true
    };

    if (search) {
      whereCondition[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await this.model.findAndCountAll({
      where: whereCondition,
      attributes: {
        exclude: ['password'] 
      },
      include: [
        {
          association: 'role',
          attributes: ['name'],
          where: {
            name: 'writer' 
          }
        }
      ],
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

  async getWriterProfile(userId) {
    try {
      const user = await this.model.findOne({
        where: { id: userId },
        attributes: [
          'id',
          'username',
          'email',
          'bookCount',
          'createdAt'
        ],
        include: [
          { 
            association: 'role',
            attributes: ['id', 'name'],
            where: { name: 'Writer' },
            required: true 
          }
        ]
      });

      if (!user) {
        return null;
      }

      return new UserResponseDto(user.get({ plain: true }));

    } catch (error) {
      console.error(`getWriterProfile Error (userId: ${userId}):`, error);
      throw error; 
    }
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

  async getRoleByName(roleName) {
    const RoleModel = await this.model.sequelize.models.Role;

    if (!RoleModel) {
      throw new Error('Roles modeli sistemde bulunamadı.');
    }

    const role = await RoleModel.findOne({ where: { name: roleName } });
    return role;
  } 

  async updateRole(userId, roleName) {
    const RoleModel = await this.model.sequelize.models.Role; 
    
    if (!RoleModel) {
      throw new Error('Roles modeli sistemde bulunamadı.');
    }

    const role = await RoleModel.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`'${roleName}' adında bir rol bulunamadı.`);
    }

    const user = await this.model.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    let isAdmin = false;
    if (user.roleId) {
      const currentRole = await RoleModel.findOne({ where: { id: user.roleId } });
      if (currentRole && currentRole.name.toLowerCase() === 'admin') {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      user.roleId = role.id;
      await user.save();
    }

    return { 
      success: !isAdmin, 
      user 
    };
  }
}

module.exports = UserRepository;
