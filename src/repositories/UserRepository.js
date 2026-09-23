const BaseRepository = require('./BaseRepository');

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


}

module.exports = UserRepository;