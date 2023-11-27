module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define('locations', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        latitude: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'latitude'
        },
        longitude: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'longitude'
        },
        timestamp: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'timestamp'
        },
        location_name: { 
            type: Sequelize.STRING,
            allowNull: false,
            field: 'location_name' 
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

    return Location;
};
