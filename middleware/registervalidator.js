
const { body } = require('express-validator');

const { userModel } = require('../models')
// Mengimport model 'devices' dari modul Sequelize

const registerValidator = [
  body("email")
    .notEmpty().withMessage("email wajib diisi")
    .isEmail().withMessage("Format email tidak tepat")
    .custom(async (value) => {
      // Menggunakan async/await untuk melakukan pencarian dalam database
      const existingDevice = await userModel.findOne({ where: { email: value } });

      if (existingDevice) {
        throw new Error("Email sudah terdaftar");
      }

      return true;
    }),
    body("tanggal_lahir")
    .notEmpty().withMessage("email wajib diisi")
    .custom((value) => {
      const datePattern = /^\d{2}-\d{2}-\d{4}$/;
      if (!datePattern.test(value)) {
        throw new Error('Format tanggal tidak valid (MM-DD-YYYY)');
      }
      return true;
    }),
];

module.exports = registerValidator;