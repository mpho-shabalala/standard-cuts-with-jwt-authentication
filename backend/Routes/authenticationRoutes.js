const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const router = express.Router();

router.route('/users')
.post(authenticationController.postUser)
.get(authenticationController.getAllAuthenticatedUsers);

router.route('/recover_account').post(authenticationController.forgotPassword)

router.route('/login').post(authenticationController.getUser);
module.exports = router;