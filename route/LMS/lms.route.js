const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');
const { SECRET_KEY } = require("../../items");
const { GroupModulModel, ModulModel, UlasanModulModel, userModel } = require('../../models');
const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');
const ulasanmodulModel = require('../../models/ulasanmodul.model');

router.post('/lms', protect, async (req, res) => {
    res.status(201).json({ message: 'lms access!' });
});

router.post('/add_groupmodul',  protect, async (req, res) => {
  try {
    const group = req.body;
  
    const groupmodulbaru = await GroupModulModel.create({
      image: group.urlgambar,
      title: group.title,
      description: group.description,
      benefit: group.benefit,
    });
  
    return res.status(200).json({
      errr: false,
      message: "Tambah ulasan group modul sukses",
      modul: {
      id: groupmodulbaru.id,
      title: groupmodulbaru.title,
      description: groupmodulbaru.description,
      benefit: groupmodulbaru.benefit
      },
  });
      
  } catch (error) {
      console.error(error);
      res.status(400).json({ 
          error: true,
          message: 'Kesalahan saat mengunggah Group Modul' });
  }
});

router.post('/add_modul/:id_group',  protect, async (req, res) => {
  try {
    const modul = req.body;
    const idgroup = req.params.id_group
  
    const modulbaru = await ModulModel.create({
      id_group: idgroup,
      title: modul.title,
      video: modul.urlvidio,
      description: modul.description,
    });
  
    return res.status(200).json({
      errr: false,
      message: "Tambah ulasan modul",
      modul: {
      id: modulbaru.id,
      id_group: modulbaru.id_group,
      title: modulbaru.title,
      vidio: modulbaru.video,
      description: modulbaru.description
      },
  });
      
  } catch (error) {
      console.error(error);
      res.status(400).json({ 
          error: true,
          message: 'Kesalahan saat mengunggah Modul' });
  }
  
    });


router.get('/all_group',  protect, async (req, res) => {
  try {
    const modul = await GroupModulModel.findAll();
  
    return res.status(201).json({
      error: false,
      message: "berhasil!",
      Modul: {
        
        modul
      },
  });
      
  } catch (error) {
      console.error(error);
      res.status(400).json({ 
          error: true,
          message: 'Kesalahan saat mengunggah' });
  }

});

router.get('/getgroup/:id_group',  protect, async (req, res) => {
  try {
    const idgroup = req.params.id_group
  
    const modul = await GroupModulModel.findOne({
      where: {
          id: idgroup

      }
  });
  
    return res.status(201).json({
      error: false,
      message: "berhasil!",
      Modul: {
        
        modul
      },
  });
      
  } catch (error) {
      console.error(error);
      res.status(400).json({ 
          error: true,
          message: 'Kesalahan saat mengunggah' });
  }

  });

router.get('/all_modul/:id_group',  protect, async (req, res) => {
  try {
    const idgroup = req.params.id_group
  
    const modul = await ModulModel.findAll({
      where: {
          id_group: idgroup

      }
  });
  
    return res.status(201).json({
      error: false,
      message: "Berhasil!",
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


  router.get('/modul/:id',  protect, async (req, res) => {
    try {
      const idgroup = req.params.id
    
      const modul = await ModulModel.findOne({
        where: {
            id: idgroup
  
        }
    });
    
      return res.status(201).json({
        error: false,
        message: "Berhasil!",
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

router.post('/add_ulasan/:id_group', protect, async (req, res) => {
try {
  const ulasan = req.body;
  const loggedInUser = req.user;
  const idgroup = req.params.id_group

  const ulasanbaru = await UlasanModulModel.create({
    id_user: loggedInUser.id,
    id_group: idgroup,
    name: loggedInUser.name,
    pekerjaan: ulasan.pekerjaan,
    rating: ulasan.rating,
    isi: ulasan.isi,


  });

  return res.status(200).json({
    errr: false,
    message: "Tambah ulasan berhasil",
    Ulasan: {
    id_user: ulasanbaru.id_user,
    id_modul: ulasanbaru.id_modul,
    name: ulasanbaru.name,
    pekerjaan: ulasanbaru.pekerjaan,
    rating: ulasanbaru.rating,
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



  router.get('/ulasan/:id_group',  protect, async (req, res) => {
    try {
      const idmodul = req.params.id_group
    
      const ulasan = await UlasanModulModel.findAll({
        where: {
            id_group: idmodul

        }
    });
    
      return res.status(200).json({
        error: false,
        message: "Berhasil!",
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
