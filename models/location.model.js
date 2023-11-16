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
        
    });

    return Location;
};
