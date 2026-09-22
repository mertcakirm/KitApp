const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('KitApp', 'root', 'mySqlContainer1', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const _context = {};

_context.Users = require('../models/User')(sequelize);
_context.Books = require('../models/Book')(sequelize);
_context.Roles = require('../models/Role')(sequelize);
_context.Categories = require('../models/Category')(sequelize);

// --- Role & User (One-to-Many) ---
_context.Roles.hasMany(_context.Users, {
  foreignKey: { name: 'roleId', type: DataTypes.UUID, allowNull: true },
  as: 'users'
});
_context.Users.belongsTo(_context.Roles, {
  foreignKey: { name: 'roleId', type: DataTypes.UUID, allowNull: true },
  as: 'role'
});

// --- User & Book (One-to-Many) ---
_context.Users.hasMany(_context.Books, { 
  foreignKey: { name: 'userId', type: DataTypes.UUID }, 
  as: 'books' 
});
_context.Books.belongsTo(_context.Users, { 
  foreignKey: { name: 'userId', type: DataTypes.UUID }, 
  as: 'uploader' 
});

// --- Book & Category (Many-to-Many) ---
_context.Books.belongsToMany(_context.Categories, { 
  through: 'book_categories', 
  foreignKey: { name: 'bookId', type: DataTypes.UUID }, 
  as: 'categories' 
});
_context.Categories.belongsToMany(_context.Books, { 
  through: 'book_categories', 
  foreignKey: { name: 'categoryId', type: DataTypes.UUID }, 
  as: 'books' 
});

_context.sequelize = sequelize;
_context.Sequelize = Sequelize;

module.exports = _context;
