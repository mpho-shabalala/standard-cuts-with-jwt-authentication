const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const router = express.Router();
const {rateLimiter} = require('../middlewares/rateLimiter')

// not authenticated
router.route('/login').post(rateLimiter, authenticationController.getUser);
router.route('/recover_account').post(rateLimiter,authenticationController.forgotPassword)
router.route('/verify_user').post(rateLimiter,authenticationController.verifyUser);
router.route('/users').post(rateLimiter,authenticationController.postUser)
// .get(authenticationController.getAllAuthenticatedUsers);

//authenticated
router.route('/renew_password').post(rateLimiter,authenticationController.resetPassword)
router.route('/refresh-token').get(rateLimiter,authenticationController.refreshAccessToken);

router.route('/logout').post(rateLimiter,authenticationController.logoutUser);

module.exports = router;