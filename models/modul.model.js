module.exports = (sequelize, Sequelize) => {
const Groupmodul = require('./groupmodul.model')(sequelize, Sequelize);
// Define the model for the modul table
  const ModulModel = sequelize.define('modul', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_group: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(225),
    },
    video: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.STRING(225),
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

  // Define the relationship with the group_article table
  ModulModel.belongsTo(Groupmodul, { foreignKey: 'id_group' });

  return ModulModel;
};

