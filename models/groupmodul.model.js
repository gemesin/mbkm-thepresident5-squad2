// Import Sequelize// Define the model for the group_article table
module.exports = (sequelize, Sequelize) => {

  const User = require('./user.model')(sequelize, Sequelize);
  const GroupArticleModel = sequelize.define('group_article', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: Sequelize.TEXT,
    },
    title: {
      type: Sequelize.STRING(225),
    },
    description: {
      type: Sequelize.TEXT,
    },
    benefit: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('current_timestamp()'), 
      field: 'createdAt'
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });

  return GroupArticleModel;
};


