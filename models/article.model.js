module.exports = (sequelize, Sequelize) => {
    const Artikel = sequelize.define('Artikel', {
        id: { 
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        timestamp: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn('now'),
        },
        title: {
          type: DataTypes.STRING(225),
        },
        name: {
          type: DataTypes.STRING(225),
        },
        image: {
          type: DataTypes.TEXT,
        },
        desc: {
          type: DataTypes.STRING(225),
        },
        article: {
          type: DataTypes.TEXT, 
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('current_timestamp()'), 
            field: 'createdAt'
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true, 
            field: 'updatedAt'
        },

      });
  
    return Artikel;
  }
  