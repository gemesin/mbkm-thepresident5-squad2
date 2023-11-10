const { body } = require('express-validator');

const { userModel } = require('../models')
// Mengimport model 'devices' dari modul Sequelize

const ForgetValidator = [
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
    body("answer_question")
    .notEmpty().withMessage("answer_question wajib diisi")
];

module.exports = ForgetValidator;