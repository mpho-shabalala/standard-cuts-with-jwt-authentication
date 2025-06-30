const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();
exports.readData = (relativeFilePath) => {
    let data= {};
    try{
        data = JSON.parse(fs.readFileSync(relativeFilePath, 'utf8'));
        return data;
    }catch(error){
        return error.mesage;
    }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendPasswordResetEmail = async (to, resetToken, username) => {
  const resetURL = `${process.env.PAGE_RECOVER_URL}/resetPassword.html?token=${resetToken}`; // frontend route

  const mailOptions = {
    from: `Standard Cuts Support Team <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: 'Reset your password',
    html: `
      <img src='../resources/main-logo.png' />
      <h1>Hello ${username}</h1>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

exports.sendVerificationEmail = async (to , verificationToken, username) => {
   const verificationURL = `${process.env.PAGE_RECOVER_URL}/verifyUser.html?token=${verificationToken}`; // frontend route
   console.log(verificationURL)
  const mailOptions = {
     from: `Standard Cuts Support Team" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: 'Please verify your email address',
    html: 
      `<h2>Welcome, ${username}!</h2>
      <p>Thanks for signing up. We are thrilled to have you. Please verify your email by clicking the link below:</p>
      <a href="${verificationURL}">Verify Email</a>
      <p>If you didn't sign up, please ignore this email.</p>`
    ,
  };
  console.log(mailOptions)
  return await transporter.sendMail(mailOptions);
}


