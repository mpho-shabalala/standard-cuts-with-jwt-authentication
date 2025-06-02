const express = require('express');
const userCreditDetailsController = require('../controllers/userCreditDetailsController');
const router = express.Router();

router.route('/users_credit_details').get(userCreditDetailsController.getAllUserCreditDetails);
router.route('/user_credit_details').get(userCreditDetailsController.getUserCreditDetails);
module.exports = router;