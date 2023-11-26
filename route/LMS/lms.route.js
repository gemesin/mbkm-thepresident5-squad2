const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');
const { SECRET_KEY } = require("../../items");
const { GroupArticleModel, ModulModel, UlasanModulModel, userModel } = require('../../models');
const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');
const ulasanmodulModel = require('../../models/ulasanmodul.model');

router.post('/lms', protect, async (req, res) => {
    res.status(201).json({ message: 'lms access!' });
});

router.post('/add_groupmateri', async (req, res) => {
  
});

router.get('/all_group', async (req, res) => {

  });

router.get('/all_modul/:id_group', async (req, res) => {
  try {
    const idgroup = req.params.id_group
  
    const modul = await ModulModel.findAll({
      where: {
          id_group: idgroup

      }
  });
  
    return res.status(200).json({
      message: "Tambah ulasan berhasil",
      Modul: {
        
        modul
      },
  });
      
  } catch (error) {
      console.error(error);
      res.status(400).json({ 
          error: true,
          message: 'Kesalahan saat mengunggah ulasan' });
  }


  });

router.post('/add_ulasan/:id_modul', protect, async (req, res) => {
try {
  const ulasan = req.body;
  const loggedInUser = req.user;
  const idmodul = req.params.id_modul

  const ulasanbaru = await UlasanModulModel.create({
    id_user: loggedInUser.id,
    id_modul: idmodul,
    name: loggedInUser.name,
    isi: ulasan.isi,


  });

  return res.status(200).json({
    message: "Tambah ulasan berhasil",
    Ulasan: {
    id_user: ulasanbaru.id_user,
    id_modul: ulasanbaru.id_modul,
    name: ulasanbaru.name,
    isi: ulasanbaru.isi,
    },
});
    
} catch (error) {
    console.error(error);
    res.status(400).json({ 
        error: true,
        message: 'Kesalahan saat mengunggah ulasan' });
}

  });

  router.get('/ulasan/:id_modul', async (req, res) => {
    try {
      const idmodul = req.params.id_modul
    
      const ulasan = await UlasanModulModel.findAll({
        where: {
            id_modul: idmodul

        }
    });
    
      return res.status(200).json({
        message: "Tambah ulasan berhasil",
        Ulasan: ulasan,
    });
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            error: true,
            message: 'Kesalahan saat mengunggah ulasan' });
    }


  });
  


  
  
router.use(erorHandlerMiddleware);

module.exports = router;
