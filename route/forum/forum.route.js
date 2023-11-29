const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/middleware');
const { SECRET_KEY } = require("../../items");
const { ForumModel, commentModel, userModel } = require('../../models');
const { body, validationResult } = require("express-validator");
const erorHandlerMiddleware = require('../../middleware/error-handling');
const ulasanmodulModel = require('../../models/ulasanmodul.model');

router.get('/test',  async (req, res) => {
    res.status(201).json({ message: 'lms access!' });
});

    
router.use(erorHandlerMiddleware);

module.exports = router;
