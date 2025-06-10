// const users = require('../database/main_db').users;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const shortid = require("shortid");
const util = require('./utilities')
const userDBPath = '../Backend/database/users.json';
const bcrypt = require('bcrypt');

exports.getAllAuthenticatedUsers = async (req, res, next) => {
    try{
        const data = util.readData(userDBPath);
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

exports.getUser = async (req, res, next) => {
     const { username = null, password = null } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Username and password are required',
    });
  }
    // console.log({userID,username,password})
    try{
        const userData = util.readData(userDBPath);
        const user = userData.users.find((u) => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({
            status: 'fail',
            message: 'Invalid username or password',
            errorCode: 'USER_NOT_FOUND'
            })
        }
        // Sign JWT token with userID as payload
        const token = jwt.sign({ userID: user.userID }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h',});

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


    const data = util.readData(userDBPath);
    
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

      // 4. Create new user with hashed password
    const newUser = {
      userID,
      username,
      email,
      contacts,
      password: hashedPassword, // use hashed password
      acceptNewsletter: acceptNewsletter === 'on',
    };

    // 2. Create and store user
    data.users.push(newUser);
    fs.writeFileSync(userDBPath, JSON.stringify(data));

    // 3. JWT generation
    const token = jwt.sign(
      { userID: newUser.userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Respond with created user info (without password)
    return res.status(201).json({
      status: 'success',
      token,
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

