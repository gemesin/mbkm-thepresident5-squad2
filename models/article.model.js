const { DataTypes } = require('sequelize');

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
        description: {
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

    Artikel.findAllArticles = async () => {
      try {
        const articles = await Artikel.findAll();
        return articles;
      } catch (error) {
        throw error;
      }
    };
  
  
    return Artikel;
};
