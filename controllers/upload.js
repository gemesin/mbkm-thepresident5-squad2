// upload.js atau controller.js
const multer = require('multer');
const path = require('node:path');

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Direktori tempat menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang disimpan
  },
});

// Inisialisasi upload menggunakan konfigurasi storage
const upload = multer({ storage: storage });

module.exports = {
  uploadSingleImage: upload.single('icon'),
  // ... (fungsi-fungsi lainnya)
};
