const express = require('express');
const genreController = require('../controllers/genreControllers');
const router = express.Router();

router.route('/').get(genreController.getAllGenres);
module.exports = router;