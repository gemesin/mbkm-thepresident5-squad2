module.exports = (sequelize, Sequelize) => {
    const Modul = require('./modul.model')(sequelize, Sequelize);
    const User = require('./user.model')(sequelize, Sequelize);
    // Define the model for the modul table
    const UlasanModulModel = sequelize.define('ulasan_modul', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_user: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        id_modul: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: { 
          type: Sequelize.STRING,
          allowNull: false,
      },
        isi: {
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
      
      // Define the relationships with the target_users and target_moduls tables
      UlasanModulModel.belongsTo(User, { foreignKey: 'id_user' });
      UlasanModulModel.belongsTo(Modul, { foreignKey: 'id_modul' });
    
      return UlasanModulModel;
    };
    
    