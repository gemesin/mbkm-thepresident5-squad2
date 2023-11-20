const express = require('express');

const router = express.Router();

const { SECRET_KEY } = require("../../items");
const { articleModel } = require('../../models');

const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');

// Endpoint untuk tambah artikel post
router.post('/add_article', async (req, res) => {
  try {
    const data = req.body;

    const newArtikel = await Artikel.create({
      title: data.title,
      name: data.name,
      image: data.image,
      desc: data.desc,
      article: data.article,
    });

    res.status(201).json({ message: 'Article added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'It was a mistake to add the article' });
  }
});


router.use(erorHandlerMiddleware);

module.exports = router;