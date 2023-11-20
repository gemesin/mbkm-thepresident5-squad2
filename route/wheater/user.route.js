const express = require('express');
const { protect } = require('../../middleware/middleware');
const axios = require('axios');
const router = express.Router();
const { Op } = require('sequelize');
const { logo } = require("../../items");
const { locationModel, weather_dataModel } = require('../../models'); // Sesuaikan dengan path dan nama model yang sesuai

router.use(protect);

router.get('/weather', protect, async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        if (isNaN(parsedLat) || isNaN(parsedLon)) {
            return res.status(400).json({ error: 'Latitude dan Longitude harus nilai numerik.' });
        }

        // Cek apakah data cuaca sudah ada dalam database untuk lokasi dan waktu yang sesuai
        const currentTime = new Date();
        const twentyMinutesAgo = new Date(currentTime - 20 * 60 * 1000);
        const tolerance = 0.0001;
        const location = await locationModel.findOne({
            where: {
                latitude: {
                    [Op.between]: [parsedLat - tolerance, parsedLat + tolerance]
                },
                longitude: {
                    [Op.between]: [parsedLon - tolerance, parsedLon + tolerance]
                },
                timestamp: {
                    [Op.gte]: twentyMinutesAgo
                }

            }
        });

        if (location) {
            console.log('Query Where:', {
                hasil: location,
                location_id: location.id,
                timestamp: {
                    [Op.gte]: twentyMinutesAgo
                }
            });
            const weatherData = await weather_dataModel.findOne({
                where: {
                    location_id: location.id,
                    timestamp: {
                        [Op.gte]: twentyMinutesAgo
                    }
                },
                order: [['timestamp', 'DESC']]
            });
            if (weatherData) {
                // Jika data cuaca ada dalam database dan masih valid
                return res.json({
                    currentWeather: {
                        city: location.location_name,
                        temperature: weatherData.temperature,
                        weatherDescription: weatherData.weather_description,
                        humidity: weatherData.humidity,
                        rainChance: weatherData.rain_chance,
                        windSpeed: weatherData.wind_speed,
                        rainVolume: weatherData.rain_volume,
                        weatherIcon: weatherData.weather_icon
                    },
                    hourlyWeather: weatherData.hourly_weather,
                    weeklyWeather: weatherData.weakly_weather,
                });
            }
        }


        // Jika tidak ada data cuaca yang valid dalam database, ambil data dari OpenWeather API
        const apiKey = '859110c5e10e40ca3fd54dabb1a31914';

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const currentWeatherResponse = await axios.get(currentWeatherUrl);
        const currentWeatherData = currentWeatherResponse.data;

        const hourlyWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alert&appid=${apiKey}`;
        const hourlyWeatherResponse = await axios.get(hourlyWeatherUrl);
        const hourlyWeatherData = hourlyWeatherResponse.data;
        const weaklyWeatherData = hourlyWeatherResponse.data;


        const getWeatherGroup = (weatherId) => {
            if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
            else if (weatherId >= 300 && weatherId < 400) return 'drizzle';
            else if (weatherId >= 500 && weatherId < 600) return 'rain';
            else if (weatherId >= 600 && weatherId < 700) return 'snow';
            else if (weatherId >= 700 && weatherId < 800) return 'atmosphere';
            else if (weatherId === 800) return 'clear';
            else return 'clouds';
        };

        // Mendapatkan logo berdasarkan grup cuaca
        const getWeatherLogo = (weatherId) => {
            const group = getWeatherGroup(weatherId);
            return logo[group];
        };

        const currentTimestamp = currentWeatherData.dt  + 7 * 3600;

        // Ambil data cuaca per jam untuk 6 jam ke depan
        const hourlyWeather = hourlyWeatherData.hourly.filter(hour => hour.dt >= currentTimestamp && hour.dt <= currentTimestamp + 6 * 3600);
        
        const previousHourTimestamp = currentTimestamp - 3600;
        
        const hourlyWeatherBefore = hourlyWeather
            .filter(hour => hour.dt >= previousHourTimestamp && hour.dt < currentTimestamp)
            .map(hour => ({
                time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                temperature: hour.temp,
                pop: hour.pop,
                weatherDescription: hour.weather[0].description,
                weatherIcon: getWeatherLogo(hour.weather[0].id)
            }));
        
        console.log("data sebelum: " + hourlyWeatherBefore);
        
        const hourlyWeatherNow = {
            time: new Date(currentTimestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            temperature: hourlyWeatherData.current.temp,
            weatherDescription: hourlyWeatherData.current.weather[0].description,
            pop: hourlyWeatherData.current.pop,
            weatherIcon: getWeatherLogo(hourlyWeatherData.current.weather[0].id)
        };
        
        const currentTimestampPlus5Hours = currentTimestamp + 5 * 3600;
        
        const hourlyWeatherNext5Hours = hourlyWeather
            .filter(hour => hour.dt > currentTimestamp && hour.dt <= currentTimestampPlus5Hours)
            .map(hour => ({
                time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                temperature: hour.temp,
                weatherDescription: hour.weather[0].description,
                pop: hour.pop,
                weatherIcon: getWeatherLogo(hour.weather[0].id)
            }));
        
        const hourlyWeatherSorted = hourlyWeatherBefore.concat(hourlyWeather, hourlyWeatherNext5Hours);
        
        const weeklyWeather = weaklyWeatherData.daily.slice(0, 7);

        const lastHourlyWeatherBefore = hourlyWeatherNow[hourlyWeatherNow.length - 1];
        const rainChanceValue = hourlyWeatherNext5Hours[0].pop ? hourlyWeatherNext5Hours[0].pop : 0;


        const insertLocation = await locationModel.create({
            latitude: lat,
            longitude: lon,
            timestamp: currentTime,
            location_name: currentWeatherData.name
        });

        const insertedWeatherData = await weather_dataModel.create({
            location_id: insertLocation.id,
            timestamp: currentTime,
            temperature: currentWeatherData.main.temp,
            weather_description: currentWeatherData.weather[0].description,
            humidity: currentWeatherData.main.humidity,
            rain_chance: rainChanceValue.toString(),
            wind_speed: hourlyWeatherData.current.wind_speed,
            rain_volume: hourlyWeatherData.current.rain ? hourlyWeatherData.current.rain['1h'] : 0,
            weather_icon: getWeatherLogo(currentWeatherData.weather[0].id),
            cached: true,
            hourly_weather: hourlyWeatherSorted,
            weakly_weather: weeklyWeather.map(day => ({
                date: new Date(day.dt * 1000).toLocaleDateString('en-US'),
                temperature: day.temp.day,
                weatherDescription: day.weather[0].description,
                weatherIcon: getWeatherLogo(day.weather[0].id) // Perbarui cara mendapatkan ikon cuaca mingguan
            }))

        });

        // Kirim data cuaca ke klien
        res.json({
            currentWeather: {
                city: insertLocation.location_name,
                temperature: insertedWeatherData.temperature,
                weatherDescription: insertedWeatherData.weather_description,
                humidity: insertedWeatherData.humidity,
                rainChance: insertedWeatherData.rain_chance,
                windSpeed: insertedWeatherData.wind_speed,
                rainVolume: insertedWeatherData.rain_volume,
                weatherIcon: insertedWeatherData.weather_icon
            },
            hourlyWeather: insertedWeatherData.hourly_weather,
            weeklyWeather: weeklyWeather.map(day => ({
                date: new Date(day.dt * 1000).toLocaleDateString('en-US'),
                temperature: day.temp.day,
                weatherDescription: day.weather[0].description,
                weatherIcon: getWeatherLogo(day.weather[0].id)
            }))
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam permintaan.' });
    }
});


router.get('/user/:id', async (req, res) => {
    const id = req.params.id;

    const dataUser = await userModel.findOne({
        where: {
            id: id
        }
    })

    if (!dataUser) {
        return res.status(404)
            .json({
                message: "Data user tidak ditemukan",
                data: {}
            })
    }

    return res.status(200)
        .json({
            message: "Berhasil mendapatkan data user",
            data: dataUser
        });
})

router.post('/user', async (req, res) => {
    const { name, email } = req.body;

    const createUser = await userModel.create({
        name: name,
        email: email
    })

    if (!createUser) {
        return res.status(400)
            .json({
                message: "Gagal Menambah users",
                data: {}
            })
    } return res.status(201)
        .json({
            message: "Berhasil menambahkan data user",
            data: createUser
        })

});

router.put('/user/:id', async (req, res) => {
    const id = req.params.id;

    const { name, email } = req.body;

    const updateUser = await userModel.update({
        name: name,
        email: email
    }, {
        where: {
            id: id
        }
    })

    if (!updateUser) {
        return res.status(400)
            .json({
                message: "Gagal ubah data user",
                data: {}
            })
    }

    const dataUser = await userModel.findOne({
        where: {
            id: id
        }
    })

    return res.status(200)
        .json({
            message: "Berhasil ubah data user",
            data: dataUser
        })
})

router.delete('/user/:id', async (req, res) => {
    const id = req.params.id;

    const deleteUser = await userModel.destroy({
        where: {
            id: id
        }
    })

    if (!deleteUser) {
        return res.status(400)
            .json({
                message: "Gagal hapus data user",
                data: {}
            })
    }

    return res.status(200)
        .json({
            message: "Berhasil hapus data user",
            data: {}
        })
})



module.exports = router
