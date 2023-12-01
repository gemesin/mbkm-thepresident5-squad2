module.exports = (sequelize, Sequelize) => {
    const User = require('./user.model')(sequelize, Sequelize);
    // Define the model for the modul table
    const ForumModel = sequelize.define('forum', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_user: {
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
        image: {
            type: Sequelize.TEXT,
            allowNull: true,
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
      
      // Define the relationships with the target_users and target_moduls tables
      ForumModel.belongsTo(User, { foreignKey: 'id_user' });    
      return ForumModel;
    };
    
    