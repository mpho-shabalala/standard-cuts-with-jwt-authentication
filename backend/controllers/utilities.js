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
    from: `"Standard Cuts Support Team" <${process.env.EMAIL_USERNAME}>`,
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

  return transporter.sendMail(mailOptions);
};


