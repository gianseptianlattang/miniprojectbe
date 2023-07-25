const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
const SendEmail = {
  verifyEmail: async (dataEmail, dataToken) => {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: dataEmail,
      subject: "Email Verification",
      text: "Please verify your email by clicking the link below:",
      html: `<h4>Please verify your email by clicking the link below:</h4>
      <a href="http://localhost:8000/auth/verify/${dataToken}">Verify Account</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  },

  changeUsernameEmail: async (dataEmail, newUsername, changes) => {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: dataEmail,
      subject: `${changes} Changed`,
      text: "Thankyou",
      html: `<h2> ${changes} has been changed to "${newUsername}"</h2>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Data sent to email");
    } catch (error) {
      console.error("Error sending data to email:", error);
    }
  },
};

module.exports = SendEmail;
