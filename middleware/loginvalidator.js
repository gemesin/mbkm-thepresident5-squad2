
const { body } = require('express-validator');

const { userModel } = require('../models')
// Mengimport model 'devices' dari modul Sequelize

const loginValidator = [
  body("email")
    .notEmpty().withMessage("email wajib diisi")
    .isEmail().withMessage("Format email tidak tepat")
    .custom(async (value) => {
      // Menggunakan async/await untuk melakukan pencarian dalam database
      const existingDevice = await userModel.findOne({ where: { email: value } });

      if (!existingDevice) {
        throw new Error("Email/password salah");
      }

      return true;
    }),
    body("password")
    .notEmpty().withMessage("password wajib diisi")
];

module.exports = loginValidator;