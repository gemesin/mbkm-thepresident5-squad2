const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');
const { ForumModel , commentModel } = require('../../models');
const erorHandlerMiddleware = require('../../middleware/error-handling');
const multer = require('multer');
const path = require('node:path');
const { uptime } = require('node:process');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Direktori tempat menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang disimpan
  },
});

const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/upload_and_add_forum', protect, upload.single('image'), async (req, res) => {
  try {
    const loggedInUser = req.user;
    const forum = req.body.isi;
    const uploadedFile = req.file;

   if (!uploadedFile) {
    const forumbaru = await ForumModel.create({
        id_user: loggedInUser.id,
        name: loggedInUser.name,
        fill: forum,
        image: null,
      });
  
      res.status(200).json({
        error: false,
        message: "Tambah forum berhasil",
        Ulasan: {
          id_user: forumbaru.id_user,
          name: forumbaru.name,
          isi: forumbaru.fill,
          image: forumbaru.image,
        },
      });
    
   }

   const filePath = path.join('images', uploadedFile.filename);
   const fileUrl = req.protocol + '://' + req.get('host') + '/' + filePath;

    const forumbaru = await ForumModel.create({
      id_user: loggedInUser.id,
      name: loggedInUser.name,
      fill: forum,
      image: fileUrl,
    });

    res.status(200).json({
      error: false,
      message: "Tambah forum berhasil",
      Ulasan: {
        id_user: forumbaru.id_user,
        name: forumbaru.name,
        isi: forumbaru.fill,
        image: forumbaru.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: 'Terjadi kesalahan saat mengunggah file atau menambah forum.',
    });
  }
});


router.get('/notifikasi', async (req, res) => {
    const loggedInUser = req.user;
    const id =  loggedInUser.id
        try {
          const comment = await commentModel.findAll({
            where: {
                reply_user : id
      
            }
        });
        
          return res.status(201).json({
            error: false,
            message: "notifikasi",
            nama: comment.name + " menanggapi postingan anda"
            
        });
            
        } catch (error) {
            console.error(error);
            res.status(400).json({ 
                error: true,
                message: 'Kesalahan saat mengunggah' });
        }
      
  });


router.get('/test', async (req, res) => {
  res.status(201).json({ message: 'lms access!' });
});

// router.post('/add_forum', protect, async (req, res) => {
//   try {
//     const forum = req.body;
//     const loggedInUser = req.user;

//     const forumbaru = await ForumModel.create({
//       id_user: loggedInUser.id,
//       name: loggedInUser.name,
//       fill: forum.isi,
//       image: forum.image,
//     });

//     return res.status(200).json({
//       errr: false,
//       message: "Tambah forum berhasil",
//       Ulasan: {
//         id_user: forumbaru.id_user,
//         name: forumbaru.name,
//         isi: forumbaru.fill,
//         image: forumbaru.image,
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       error: true,
//       message: 'Kesalahan saat mengunggah forum'
//     });
//   }
// });

router.use(erorHandlerMiddleware);

module.exports = router;
