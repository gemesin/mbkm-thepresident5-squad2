module.exports = (sequelize, Sequelize) => {
    const User = require('./user.model')(sequelize, Sequelize);
    const Thread = require('./threads.model')(sequelize, Sequelize);
    const Comment = sequelize.define('Comments', {
      comment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      thread_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  
    // Definisikan hubungan antara Comment dan User
    Comment.belongsTo(User, {
      foreignKey: 'user_id',
    });
  
    // Definisikan hubungan antara Comment dan Thread
    Comment.belongsTo(Thread, {
      foreignKey: 'thread_id',
    });
  
    return Comment;
  };
  