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
const forgetValidator =require("../../middleware/forgetvalidator");
const newpassValidator =require("../../middleware/newpassvalidator");

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


router.post('/forget_pass', forgetValidator , async (req, res) => {
  const { email, securityAnswer } = req.body;

  try {
      // Find the user by email
      const user = await userModel.findOne({
          where: {
              email: email
          }
      });

      if (!user) {
          return res.status(404).json({
              message: 'User not found',
              data: {}
          });
      }

      if (securityAnswer == user.answer_question) {
          // Security answer matches
          return res.status(200).json({
              message: 'Password reset instructions sent successfully',
              data: {}
          });
      } else {
          return res.status(400).json({
              message: 'Security answer does not match',
              data: {}
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          message: 'Internal Server Error',
          data: {}
      });
  }
});


router.put('/new_pass', newpassValidator , async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      // Find the user by email
      const user = await userModel.findOne({
          where: {
              email: email
          }
      });
      const id = user.id;
      console.log("pass lama :"+user.password)
      if (!user) {
          return res.status(404).json({
              message: 'User not found',
              data: {}
          });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const newUser = {
          ...req.body,
          password: hashedPassword,
        };

      const updateUser = await userModel.update({
          password: hashedPassword
      }, {
          where: {
              id: id
          }
      })
  
      if (!updateUser) {
          return res.status(400)
              .json({
                  message: "Gagal ubah data user",
                  data: {}
              })
      }
  
      const newpass = await userModel.findOne({
          where: {
              id: id
          }
      }) 

      console.log("pass baru :"+newpass.password)
  
      return res.status(200).json({
          message: 'Password updated successfully',
          data: newpass
      });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          message: 'Internal Server Error',
          data: {}
      });
  }
});
router.use(erorHandlerMiddleware);

module.exports = router;
