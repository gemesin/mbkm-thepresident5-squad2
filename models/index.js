const dbConfig = require('../confing/db_config');

const Sequelize = require('sequelize');
const { dialect } = require('../confing/db_config');

const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        define: {
            timestamps: false,
            freezeTableName: true
        },
        logging: true
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require('./user.model')(sequelize, Sequelize);
db.threadsModel = require('./threads.model')(sequelize, Sequelize);
db.commentModel = require('./comment.model')(sequelize, Sequelize);
db.locationModel = require('./location.model')(sequelize, Sequelize);
db.weather_dataModel = require('./weather_data.model')(sequelize, Sequelize);
db.articleModel = require('./article.model')(sequelize, Sequelize);
db.GroupArticleModel = require('./groupmodul.model')(sequelize, Sequelize);
db.ModulModel = require('./modul.model')(sequelize, Sequelize);




// db.defineAssociations = require('./associations')(sequelize, Sequelize);
// defineAssociations(db.userModel, db.threadsModel, db.commentModel);

// sequelize.sync()
//   .then(() => {
//     console.log('Database sudah terhubung dan model telah disinkronkan.');
//   })
//   .catch((err) => {
//     console.error('Kesalahan dalam menyinkronkan model dengan database:', err);
//   });

module.exports = db;
