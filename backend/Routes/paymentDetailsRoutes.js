const express = require('express');
const paymentDetailsController = require('../controllers/paymentDetailsController');
const router = express.Router();

router.route('/payment_details').get(paymentDetailsController.getAllUserPaymentDetails);
router.route('/payment_detail').get(paymentDetailsController.getPaymentDetails);
module.exports = router;