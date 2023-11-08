const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {  SECRET_KEY } = require("../../items");
const { userModel } = require('../../models');

const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');

const registerValidator = require("../../middleware/registervalidator");
const loginValidator = require("../../middleware/loginvalidator");


router.post("/register", registerValidator ,async (req, res) => {
  const errors = validationResult(req);

  const password = req.body.password;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const newUserdb = {
    ...req.body,
  };
  const newUser = {
    ...req.body,
    password: hashPassword,
  };

  const createUser = await userModel.create({
    ...newUserdb
})
delete newUser.password;

if (!createUser) {
    return res.status(400)
    .json({
        message: "Gagal Menambah users",
        data: {}
    })
} return res.status(201)
.json({
    message: "Berhasil menambahkan data user",
    data: newUser
})  

});

router.post("/login", loginValidator ,async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    where: {
        email: email,
        password: password,
    },
});

if (!user) {
  return res.status(401).json({ status: "failed", message: "Invalid email or password" });
}

// Membersihkan (trim) password yang dimasukkan oleh pengguna dan password dari database
  const cleanPassword = password;
  const cleanSavedPassword = user.password;

  if (cleanPassword != cleanSavedPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "Invalid username or password" });
  }


  const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY);
  const data = user;
  delete data.password;
  data.token = token;
  delete data.password;
  return res.json({
    status: "success",
    data,
    token,
  });
});

router.use(erorHandlerMiddleware);

module.exports = router;
