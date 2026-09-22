const _context = require('../context/AppDbContext'); // Doğrudan context çağrılır

class BaseRepository {
  constructor(modelName) {
    this.model = _context[modelName]; 
  }

  async getAll(include = []) {
    return await this.model.findAll({ include });
  }

  async getById(id, include = []) {
    return await this.model.findByPk(id, { include });
  }

  async create(data) {
    return await this.model.create(data);
  }
}

module.exports = BaseRepository;
