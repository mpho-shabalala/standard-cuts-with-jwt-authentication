// const users = require('../database/main_db').users;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const shortid = require("shortid");
const {readData, sendPasswordResetEmail, sendVerificationEmail} = require('./utilities.js')
const userDBPath = '../Backend/database/users.json';
const bcrypt = require('bcrypt');
const authService = require('../services/authenticationService');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  return res.status(result.httpCode).json(result);
}

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await authService.resetPassword(token, newPassword);

  return res.status(result.httpCode).json(result);
};
 
// GET ALL USERS (ADMIN)
exports.getAllAuthenticatedUsers = async (req, res, next) => {
  try{
    //get all user data from DB/FILE
    const data = readData(userDBPath);
    //  return all users
    return res.status(200).json({
      status: 'success',
      message: 'Users retrieved successfully',
      statusCode: 'USERS_FOUND',
      data: { users: data.users }
    });
  }catch(error){
     return res.status(500).json({
      status: 'fail',
      message: error.message,
      statusCode: 'INTERNAL_SERVER_ERROR',
      data: null
    });
  }
}


//login
  exports.getUser = async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.loginUser({ username, password });
   if (result.data?.refreshToken) {
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    delete result.data.refreshToken; // optionally hide it from frontend
  }
  return res.status(result.httpCode).json(result);
};

// REGISTER
// exports.postUser = async (req, res, next) => {
//   const userID = shortid.generate();
//   const {
//     username,
//     email,
//     contacts,
//     password,
//     acceptNewsletter
//   } = req.body;

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// if (!emailRegex.test(email)) {
//   return res.status(400).json({
//     status: 'fail',
//     message: 'Invalid email format',
//     statusCode: 'INVALID_EMAIL_FORMAT',
//     data: null
//   });
// }

// if (!password || password.length < 8) {
//   return res.status(400).json({
//     status: 'fail',
//     message: 'Password must be at least 8 characters',
//     statusCode: 'WEAK_PASSWORD',
//     data: null
//   });
// }

//   const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

//   try {
//      // Hash the password
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     // get users from DB/FILE
//     const data = readData(userDBPath);
    
//     // Conflict: user exists
//     const userExists = data.users.some(
//       u => u.username === username || u.email === email
//     );

//     if (userExists) {
//       return res.status(409).json({
//        status: 'fail',
//        message: 'A user with that username or email already exists.',
//        statusCode: 'USER_EXISTS',
//        data: null
//       });
//     }

//       //Create new user with hashed password and unverified
//     const newUser = {
//       userID,
//       username,
//       email,
//       contacts,
//       password: hashedPassword, // use hashed password
//       acceptNewsletter: acceptNewsletter === 'on',
//       emailVerified: false
//     };

//     // Create and store user
//     data.users.push(newUser);
//     fs.writeFileSync(userDBPath, JSON.stringify(data));

//      // Generate VERIFICATION token (15 min expiry)
//     const verificationToken = jwt.sign(
//     { userID: newUser.userID },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: '15m' }
//   );

//   // send email verification link
//     try {
//   await sendVerificationEmail(email, verificationToken, username);
// } catch (emailError) {
//   return res.status(500).json({
//     status: 'fail',
//     message: 'Failed to send verification email',
//     statusCode: 'EMAIL_SEND_FAILED',
//     data: null
//   });
// }

//     // Respond with created user info (without password)
//     return res.status(201).json({
//       status: 'success',
//       message: 'Registration successful. Verification email sent.',
//       statusCode: 'AWAITING_VERIFICATION',
//       data: {
//         user: {
//           username: newUser.username,
//           email: newUser.email,
//           userID: newUser.userID
//         }
//       }
//     });

//   } catch (error) {
//     return res.status(500).json({
//       status: 'fail',
//       message: 'Internal server error. Please try again later.',
//       statusCode: 'SERVER_ERROR',
//       data: null
//     });
//   }
// };


exports.postUser = async (req, res) => {
  const result = await authService.registerUser(req.body);
  return res.status(result.httpCode).json({result
  });
};



//verify user
exports.verifyUser = async (req, res) => {
  const { token } = req.body;
  const result = await authService.verifyUser(token);
  return res.status(result.httpCode).json(result);
};

// refresh token
exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshToken(refreshToken);

    if (result.status === 'fail') {
      return res.status(result.httpCode).json(result);
    }

    // Send new access token in response body
    return res.status(result.httpCode).json(result);

  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      statusCode: 'SERVER_ERROR',
      message: error.message,
      data: null
    });

  }

}

exports.logoutUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  const {error, token} = await extractToken(authHeader);
  if (error) return res.status(error.httpCode).json(error);
   const result = await authService.logoutUser(token);
  return res.status(result.httpCode).json(result);
}


