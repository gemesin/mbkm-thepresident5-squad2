const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const { protect } = require('../../middleware/middleware');
const { ForumModel , commentModel } = require('../../models');
const erorHandlerMiddleware = require('../../middleware/error-handling');
const multer = require('multer');
const path = require('node:path');
const { uptime } = require('node:process');
const forumModel = require('../../models/forum.model');
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
  
      res.status(201).json({
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

    res.status(201).json({
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
    res.status(400).json({
      error: true,
      message: 'Terjadi kesalahan saat mengunggah file atau menambah forum.',
    });
  }
});


router.get('/notifikasi', protect, async (req, res) => {
    const loggedInUser = req.user;
    const id =  loggedInUser.id
        try {
          const forumsAndComments = await commentModel.findAll({
            attributes: ['id', 'id_forum', 'name', 'fill'],
            where: {
              id_target: id,
            },
            include: [
              {
                model: ForumModel,
                attributes: ['id_user', 'name', 'image', 'fill'],
                on: {
                  id_forum: Sequelize.literal('`comment`.`id_forum` = `forum`.`id`'),
                },
                required: true,
              },
            ],
          });
      
          // Format dan kirimkan respons
          const formattedForums = forumsAndComments.map((forum) => {
            return {
              pesan: forum.name+" mengomentari postingan anda "+forum.forum.fill,
              gambar:forum.forum.image,
              comments: [
                {
                  id: forum.id,
                  fill: forum.fill,
                },
              ],
            };
          });
        
          res.status(200).json({
            error: false,
            message: 'Data berhasil diambil',
            formattedForums
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            error: true,
            message: 'Terjadi kesalahan saat mengambil data forum dan comment.',
          });
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

router.get('/allforum', protect, async (req, res) => {
  function formatTimeDifference(timeDifference) {
    // Hitung detik, menit, jam, hari, dsb.
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} hari yang lalu`;
    } else if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return `${seconds} detik yang lalu`;
    }}
  
  try {
    const allForum = await ForumModel.findAll();

    const forumDenganKomentar = await Promise.all(allForum.map(async (forum) => {
      const jumlahKomentar = await commentModel.count({ where:{id_forum: forum.id }});
      const waktuUpload = formatTimeDifference(new Date() - new Date(forum.createdAt));

      return {
        forumId: forum.id,
        nama: forum.name,
        isi: forum.fill,
        image: forum.image,
        jumlahKomentar: jumlahKomentar,
        createdAt: forum.createdAt, // Tambahkan waktu pembuatan forum
        waktuUpload: waktuUpload,
      };
    }));

    res.json(forumDenganKomentar);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: 'Terjadi kesalahan saat mengambil data forum.'
    });
  }
  
});

  // try {
  //   // const forumDenganKomentar = await ForumModel.findAll({
  //   //   attributes: [
  //   //     ['id', 'forumId'],
  //   //     'fill',
  //   //     'image',
  //   //     [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'jumlahKomentar']
  //   //   ],
  //   //   include: [{
  //   //     model: commentModel,
  //   //     as: 'comments',
  //   //     attributes: [],
  //   //     required: false,
  //   //   }],
  //   //   group: ['Forum.id', 'fill', 'image'],
  //   //   raw: true,
  //   // });

  //   const allForum = await ForumModel.findAll();

  //   const forumDenganKomentar = await Promise.all(allForum.map(async (forum) => {
  //     const jumlahKomentar = await commentModel.count({ where:{id_forum: forum.id }});
  //     return {
  //       forumId: forum.id,
  //       nama: forum.name,
  //       isi: forum.fill,
  //       image: forum.image,
  //       jumlahKomentar: jumlahKomentar,
  //     };
  //   }));

  //   res.json(forumDenganKomentar);
  // } catch (error) {
  //   console.error(error);
  //   res.status(400).json({
  //     error: true,
  //      message: 'Terjadi kesalahan saat mengambil data forum.' });
  // }


router.get('/forum/:id',protect, async (req, res) => {
  try {
    const forumId = req.params.id;

    const forum = await ForumModel.findByPk(forumId);

    if (!forum) {
      return res.status(400).json({
        error: true,
        message: 'Forum tidak ditemukan.',
      });
    }

    const komentars = await commentModel.findAll({
      where: { id_forum: forumId },
    });

    const response = {
      forum: {
        id_user: forum.id_user,
        name: forum.name,
        isi: forum.fill,
        image: forum.image,
      },
      komentars: komentars.map(komentar => ({
        id_user: komentar.id_user,
        name: komentar.name,
        isi: komentar.fill,
        image: komentar.image,
      })),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: 'Terjadi kesalahan saat mengambil data forum.',
    });
  }
});

router.post('/balasan/:id_forum', protect, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const idForum = req.params.id_forum;
    const { isi } = req.body;
    const komentars = await ForumModel.findOne({
      where: { id: idForum },
    });

    const komentarBaru = await commentModel.create({
      id_user: loggedInUser.id,
      id_target: komentars.id_user,
      name: loggedInUser.name,
      id_forum: idForum,
      fill: isi,
    });

    res.status(201).json({
      error: false,
      message: 'Balasan berhasil ditambahkan',
      Balasan: {
        id_user: komentarBaru.id_user,
        name: komentarBaru.name,
        isi: komentarBaru.fill,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: 'Terjadi kesalahan saat menambahkan balasan.',
    });
  }
});

router.use(erorHandlerMiddleware);

module.exports = router;
