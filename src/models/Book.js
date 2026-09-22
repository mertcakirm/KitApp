const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Book', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    filePath: { type: DataTypes.STRING, allowNull: false },
    isActive:{type:DataTypes.BOOLEAN,defaultValue:true},
    userId: { 
      type: DataTypes.UUID,
      allowNull: false 
    }
  }, { 
    tableName: 'books', 
    timestamps: true,
    hooks: {
      afterCreate: async (book) => {
        await sequelize.models.User.increment('bookCount', { by: 1, where: { id: book.userId } });
      },
      afterDestroy: async (book) => {
        await sequelize.models.User.decrement('bookCount', { by: 1, where: { id: book.userId } });
      }
    }
  });
};
