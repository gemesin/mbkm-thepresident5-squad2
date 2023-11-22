module.exports = (sequelize, Sequelize) => {
    const Location = require('./location.model')(sequelize, Sequelize);

    const WeatherData = sequelize.define('weather_data', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        location_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'location_id'
        },
        timestamp: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'timestamp'
        },
        temperature: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'temperature'
        },
        weather_description: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'weather_description'
        },
        humidity: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'humidity'
        },
        rain_chance: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'rain_chance'
        },
        uv_index: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'uv_index'
        },
        rain_volume: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'rain_volume'
        },
        weather_icon: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'weather_icon'
        },
        cached: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            field: 'cached'
        },
        hourly_weather: {
            type: Sequelize.JSON, // Sesuaikan dengan tipe data di database
            allowNull: false,
            field: 'hourly_weather'
        },
        weakly_weather: {
            type: Sequelize.JSON, // Sesuaikan dengan tipe data di database
            allowNull: false,
            field: 'weakly_weather'
        },
        
    });

    // Definisikan hubungan dengan tabel locations
    WeatherData.belongsTo(Location, { foreignKey: 'location_id' });

    return WeatherData;
};
