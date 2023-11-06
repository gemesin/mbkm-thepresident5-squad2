const express = require('express');
const { protect } = require('../middleware/middleware');
const router = express.Router();

const { userModel } = require('../models')

router.get('/user', protect, async (req, res) => {
    const dataUser = await userModel.findAll()

    res.status(200).json({
        message: "Berhasil ",
        data: dataUser
    });
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

module.exports = router