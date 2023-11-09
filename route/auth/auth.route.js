const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../items");
const { userModel } = require('../../models');

const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');

const registerValidator = require("../../middleware/registervalidator");
const loginValidator = require("../../middleware/loginvalidator");

router.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req);

  const password = req.body.password;

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, errors: errors.array() });
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
    ...newUser,
  });
  delete newUserdb.password;

  if (!createUser) {
    return res.status(400).json({
      error: true,
      message: "Gagal Menambah users",
      data: {},
    });
  }
  return res.status(201).json({
    error: false,
    message: "Berhasil menambahkan data user",
    data: newUserdb,
  });
});

router.post("/login", loginValidator, async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, errors: errors.array() });
  }

  const user = await userModel.findOne({
    where: {
      email: email,
    },
  });
  

  if (!user) {
    return res.status(400).json({
      error: true,
      status: "failed",
      message: "Invalid email or password",
    });
  }

  const savedPassword = user.password;

  // Memeriksa apakah password cocok dengan yang disimpan di database
  const isMatch = bcrypt.compareSync(password, savedPassword);

  if (!isMatch) {
    return res.status(401).json({
      error: true,
      status: "failed",
      message: "Invalid username or password",
    });
  }

  // Password valid, buat dan kirimkan token
  const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY);
  const data = user;
  delete data.password;
  data.token = token;
  return res.json({
    error: false,
    status: "success",
    data,
    token,
  });
});

router.use(erorHandlerMiddleware);

module.exports = router;
