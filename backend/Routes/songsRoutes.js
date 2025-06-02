const express = require('express');
const songsController = require('../controllers/songControllers');
const router = express.Router();

router.route('/').get(songsController.getAllSongs);
router.route('/house').get(songsController.getDeepHouseSongs);
router.route('/amapiano').get(songsController.getAmapianoSongs);
router.route('/hiphop').get(songsController.getHipHopSongs);


module.exports = router;