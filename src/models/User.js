const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    bookCount: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    roleId: { 
      type: DataTypes.UUID, 
      allowNull: true
    }
  }, { 
    tableName: 'users', 
    timestamps: true 
  });

  User.associate = (models) => {
    // --- Role  ---
    User.belongsTo(models.Roles, {
      foreignKey: 'roleId',
      as: 'role'
    });

    // --- Book  ---
    User.hasMany(models.Books, { 
      foreignKey: 'userId', 
      as: 'books' 
    });
  };

  return User;
};
