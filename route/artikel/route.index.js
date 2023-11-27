const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');

const { SECRET_KEY } = require("../../items");
const { articleModel } = require('../../models');
const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');

router.use(protect);

router.post('/add_article', protect, async (req, res) => {
  try {
    const data = req.body;

    const newArticle = await articleModel.create({
        title: data.title,
        name: data.name,
        image: data.image,
        desc: data.desc,
        article: data.article,
      });

    res.status(201).json({ 
      message: 'Article added successfully', });
  } catch (error) {
    console.error(error);
    res.status(5400).json({ message: 'It was a mistake to add the article' });
  }
});

router.get('/all_article', protect, async (req, res) => {
    try {
      const articles = await articleModel.findAllArticles();
      res.status(200).json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/article_id', protect, async (req, res) => {
    try {
      const { id } = req.query;
  
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID parameter' });
      }
  
      const article = await articleModel.findByPk(id);
  
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json({
        id: article.id,
        timestamp: article.timestamp,
        title: article.title,
        name: article.name,
        image: article.image,
        description: article.description, 
        article: article.article,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
router.use(erorHandlerMiddleware);

module.exports = router;
