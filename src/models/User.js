const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive:{type:DataTypes.BOOLEAN,defaultValue:true},
    bookCount: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
  }, { tableName: 'users', timestamps: true });
};
