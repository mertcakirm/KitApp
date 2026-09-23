const BaseRepository = require('./BaseRepository');
const UserResponseDto = require('../DTOs/UserDTO');

class UserRepository extends BaseRepository {
  constructor() {
    super('Users');
  }

  async findForAuthByEmail(email) {
    return await this.model.findOne({
      where: { email },
      include: ['role']
    });
  }

  async changePassword(userId , newPassword) {
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



}

module.exports = UserRepository;