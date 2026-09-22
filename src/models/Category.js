const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Category', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    isActive:{type:DataTypes.BOOLEAN,defaultValue:true},
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'categories', timestamps: false });
};
