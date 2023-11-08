module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id' 
        },
        name: { 
            type: Sequelize.STRING,
            allowNull: false,
            field: 'name' 
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'email' 
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'password' 
        },
        answer_question: {
            type: Sequelize.STRING,
            allowNull: true, 
            field: 'answer_question'
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
  
    return User;
  }
  