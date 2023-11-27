const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('node:path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/'); // Direktori tempat menyimpan file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang disimpan
    },
  });
  
  const upload = multer({ storage: storage });
  


   
   //route to upload single image
   router.post('/upload', upload.single('image'), (req, res) => {
    res.send('File berhasil diunggah!');
  });

   module.exports = router;