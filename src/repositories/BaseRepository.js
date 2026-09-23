const _context = require('../context/AppDbContext');

class BaseRepository {
  constructor(modelName) {
    this.model = _context[modelName]; 
  }

  async getAll(include = []) {
    return await this.model.findAll({ include });
  }

  async getById(id, include = []) {
    const data = await this.model.findByPk(id, { include });
    return data;
  }

  async create(data) {
    return await this.model.create(data);
  }
}

module.exports = BaseRepository;
