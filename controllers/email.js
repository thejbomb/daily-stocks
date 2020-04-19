const nodemailer = require('nodemailer')
require('dotenv').config();

// The credentials for the email account you want to send mail from. 
const credentials = {
  host: 'smtp-mail.outlook.com',
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: process.env.EMAIL_USERNAME, 
    pass: process.env.EMAIL_PASSWORD,  
  }
}

// Getting Nodemailer all setup with the credentials for when the 'sendEmail()'
// function is called.
const transporter = nodemailer.createTransport(credentials)

// exporting an 'async' function here allows 'await' to be used
// as the return value of this function.
module.exports = async (receiver, msg) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: receiver,
    subject: 'Email confirmation',
    text: msg
  })
  .catch(err => console.log(err))

}