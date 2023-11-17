module.exports = (sequelize, Sequelize) => {
    const User = require('./user.model')(sequelize, Sequelize);
    const Thread = sequelize.define('Thread', {
        thread_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Menggunakan CURRENT_TIMESTAMP
        },
    });

    // Pastikan Anda telah mengimpor model User dan menentukan hubungan dengan benar
    Thread.belongsTo(User, {
        foreignKey: 'user_id', 
    });

    return Thread;
};
