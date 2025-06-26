// const users = require('../database/main_db').users;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const shortid = require("shortid");
const {readData, sendPasswordResetEmail, sendVerificationEmail} = require('./utilities.js')
const userDBPath = '../Backend/database/users.json';
const bcrypt = require('bcrypt');

exports.forgotPassword = async(req, res) => {
  const {email} = req.body; //get email from user
  console.log(email)
  //check if user have inputed email
  if (!email) {
    return res.status(400).json({ status: 'fail', message: 'Email is required' });
  }

  //check if user with given email exist in the database
  const data = readData(userDBPath);
  const user = data.users.find(u => u.email === email);

  // Always return the same message to avoid leaking info
  if (!user) {
    return res.status(200).json({
      status: 'success',
      message: 'If that email exists, a reset link has been sent.',
    });
  }

  // Generate reset token (15 min expiry)
  const resetToken = jwt.sign(
    { userID: user.userID },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  try {
    await sendPasswordResetEmail(email, resetToken, user.username);

    return res.status(200).json({
      status: 'success',
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Could not send reset email. Try again later.',
      errorCode: 'EMAIL_ERROR',
    });
  }

}
 

exports.getAllAuthenticatedUsers = async (req, res, next) => {
    try{
        const data = readData(userDBPath);
        res.status(200).json({
            status: 'success',
            users : data.users
        })
    }catch(error){
        res.status(500).json({
            status: 'fail',
            data: null,
            message: error.message
        })
    }
}


//login
exports.getUser = async (req, res, next) => {
     const { username = null, password = null } = req.body;

     //check if username and password have been inputed
  if (!username || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Username and password are required',
    });
  }
    // console.log({userID,username,password})
    try{
        const userData = readData(userDBPath);
        // find user through username
        const user = userData.users.find((u) => u.username === username);
        // notify if user does not exist
        if (!user) {
            return res.status(401).json({
            status: 'fail',
            message: 'Invalid username or password',
            errorCode: 'USER_NOT_FOUND'
            })
        }

        // Compare input password with stored hashed password
    const match = await bcrypt.compare(password, user.password);
     if (!match) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid username or password',
        errorCode: 'INVALID_PASSWORD'
      });
    }
        // Sign JWT token with userID as payload
        const token = jwt.sign(
          { userID: user.userID }, 
          process.env.ACCESS_TOKEN_SECRET, 
          {expiresIn: '1h',});

        return res.status(200).json({
            status: 'success',
            token,
            user: {
            username: user.username,
            email: user.email,
            userID: user.userID,
            }
        });
    }catch(error){
        return res.status(500).json({
            status : 'fail',
            message : error.message,
            errorCode: 'SERVER_ERROR'
        });
    }
}

// Set users (Add user)
exports.postUser = async (req, res, next) => {
  const userID = shortid.generate();
  const {
    username,
    email,
    contacts,
    password,
    acceptNewsletter
  } = req.body;

  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

  try {

     // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const data = readData(userDBPath);
    
    // 1. Conflict: user exists
    const userExists = data.users.some(
      u => u.username === username || u.email === email
    );

    if (userExists) {
      return res.status(409).json({
        status: 'fail',
        message: 'A user with that username or email already exists.',
        errorCode: 'USER_EXISTS'
      });
    }

      // 4. Create new user with hashed password and unverified
    const newUser = {
      userID,
      username,
      email,
      contacts,
      password: hashedPassword, // use hashed password
      acceptNewsletter: acceptNewsletter === 'on',
      emailVerified: false
    };

    // 2. Create and store user
    data.users.push(newUser);
    fs.writeFileSync(userDBPath, JSON.stringify(data));

     // 3. Generate VERIFICATION token (15 min expiry)
    const verificationToken = jwt.sign(
    { userID: newUser.userID },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  // 4. send email verification link
  await sendVerificationEmail(email, verificationToken,username );


    // 4. Respond with created user info (without password)
    return res.status(201).json({
      status: 'success',
      statuscode: 'AWAITING_VERIFICATION',
      user: {
        username: newUser.username,
        email: newUser.email,
        userID: newUser.userID
      }
    });

  } catch (error) {
    // 5. Unexpected server error
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error. Please try again later.',
      errorCode: 'SERVER_ERROR'
    });
  }
};

exports.verifyUser = async (req, res) => {
  const {token} = req.body;
  try{
    //decode token attributes
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //check user existance with decoded userID
    const data = readData(userDBPath);
    const user = data.users.find(u => u.userID === decoded.userID);
    if(!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    //check if the user is already verified
    if(user.emailVerified){
      return res.status(200).json({ status: 'success', message: 'Email already verified' });
    }

    //tick user as verified and save to database
    user.emailVerified = true;
    fs.writeFileSync(userDBPath, JSON.stringify(data));
    // create authentication token to send to user frontend
    const authToken = jwt.sign(
      { userID: user.userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );


    //send basic data to the frontend
    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      token: authToken,
      statusCode: 'EMAIL_VERIFIED',
      user: {
        userID: user.userID,
        username: user.username,
        email: user.email
      }
    });
  }catch(error){
    console.log(error.message);
    //Send error response
    return res.status(200).json({
      status:'success',
      message: error.message,
      statusCode: 'EMAIL_NOT_VERIFIED'
    });
  }
}

