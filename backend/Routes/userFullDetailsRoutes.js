const express = require('express');
const userFullDetailsController = require('../controllers/userFullDetailsController')
const router = express.Router();

router.route('/user_detail').get(userFullDetailsController.getUserDetails);
module.exports = router;