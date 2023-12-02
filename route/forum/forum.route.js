const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');
const { ForumModel } = require('../../models');
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

router.get('/test', async (req, res) => {
  res.status(201).json({ message: 'lms access!' });
});

router.post('/add_forum', protect, async (req, res) => {
  try {
    const forum = req.body;
    const loggedInUser = req.user;

    const forumbaru = await ForumModel.create({
      id_user: loggedInUser.id,
      name: loggedInUser.name,
      fill: forum.isi,
      image: forum.image,
    });

    return res.status(200).json({
      errr: false,
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
      message: 'Kesalahan saat mengunggah forum'
    });
  }
});

router.get('/forum/:id',protect, async (req, res) => {
  try {
    const forumId = req.params.id;

    const forum = await ForumModel.findByPk(forumId);

    if (!forum) {
      return res.status(404).json({
        error: true,
        message: 'Forum tidak ditemukan.',
      });
    }

    const komentars = await KomentarModel.findAll({
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

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: 'Terjadi kesalahan saat mengambil data forum.',
    });
  }
});

router.post('/balasan/:id_forum', protect, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const idForum = req.params.id_forum;
    const { isi, image } = req.body;

    const komentarBaru = await KomentarModel.create({
      id_user: loggedInUser.id,
      name: loggedInUser.name,
      id_forum: idForum,
      fill: isi,
      image: image || null, // Opsional: Gambar balasan
    });

    res.status(201).json({
      error: false,
      message: 'Balasan berhasil ditambahkan',
      Balasan: {
        id_user: komentarBaru.id_user,
        name: komentarBaru.name,
        isi: komentarBaru.fill,
        image: komentarBaru.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: 'Terjadi kesalahan saat menambahkan balasan.',
    });
  }
});

router.use(erorHandlerMiddleware);

module.exports = router;
