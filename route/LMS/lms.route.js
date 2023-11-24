const express = require('express');
const router = express.Router();

const { SECRET_KEY } = require("../../items");
const { GroupArticleModel } = require('../../models');
const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');

router.post('/lms', async (req, res) => {
    res.status(201).json({ message: 'lms access!' });
});

router.post('/add_groupmateri', async (req, res) => {
  
});

router.get('/all_group', async (req, res) => {

  });
  
  
router.use(erorHandlerMiddleware);

module.exports = router;
