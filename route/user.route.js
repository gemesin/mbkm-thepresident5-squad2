const express = require('express');
const { protect } = require('../middleware/middleware');
const router = express.Router();
const axios = require('axios');

const { userModel } = require('../models')

router.get('/user', protect, async (req, res) => {
    const dataUser = await userModel.findAll()

    res.status(200).json({
        message: "Berhasil ",
        data: dataUser
    });
});

// Endpoint untuk mengambil data suhu, cuaca, dan kelembaban berdasarkan latitude dan longitude
router.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = '859110c5e10e40ca3fd54dabb1a31914'; // Gantilah dengan kunci API Anda

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude (lat) dan Longitude (lon) harus disertakan dalam permintaan.' });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    // Menampilkan data suhu, cuaca, dan kelembaban dalam respons
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const cityName = weatherData.name;

    const responseData = {
      city: cityName,
      temperature: temperature,
      weatherDescription: weatherDescription,
      humidity: humidity
    };

    res.json(responseData);
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
    const {name, email} = req.body;

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

//endpoint forget password
router.post('/Auth/forget_pass', async (req, res) => {
    const { email, securityQuestion, securityAnswer } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                data: {}
            });
        }

        if (user.security_question === securityQuestion && user.security_answer === securityAnswer) {
            const resetToken = generateResetToken();

            user.resetToken = resetToken;

            await user.save();

            sendResetPasswordEmail(user.email, resetToken);

            return res.status(200).json({
                message: 'Password reset instructions sent successfully',
                data: {}
            });
        } else {
            return res.status(400).json({
                message: 'Security question/answer do not match',
                data: {}
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            data: {}
        });
    }
});

module.exports = router