const { body } = require('express-validator');

const { userModel } = require('../models')
// Mengimport model 'devices' dari modul Sequelize

const NewpassValidator = [
  body("email")
    .notEmpty().withMessage("email wajib diisi")
    .isEmail().withMessage("Format email tidak tepat")
    .custom(async (value) => {
      // Menggunakan async/await untuk melakukan pencarian dalam database
      const existingDevice = await userModel.findOne({ where: { email: value } });

      if (!existingDevice) {
        throw new Error("Email/answer_question salah");
      }

      return true;
    }),
    body("newPassword")
    .notEmpty().withMessage("newPassword wajib diisi")
];

module.exports = NewpassValidator;