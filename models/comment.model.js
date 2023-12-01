module.exports = (sequelize, Sequelize) => {
  const User = require('./user.model')(sequelize, Sequelize);
  const Forum = require('./forum.model')(sequelize, Sequelize);
  const Comment = sequelize.define('comment', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_forum: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fill: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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

  // Definisikan hubungan antara Comment dan User
  Comment.belongsTo(User, {
    foreignKey: 'id_user',
  });

  // Definisikan hubungan antara Comment dan Thread
  Comment.belongsTo(Forum, {
    foreignKey: 'id_forum',
  });

  return Comment;
};
