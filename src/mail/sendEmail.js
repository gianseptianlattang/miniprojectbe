const nodemailer = require("nodemailer");

const SendEmail = {
  verifyEmail: async (dataEmail, dataToken) => {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "gianslpurwadhika@hotmail.com",
        pass: "gianPurwadhika",
      },
    });

    const mailOptions = {
      from: "gianslpurwadhika@hotmail.com",
      to: dataEmail,
      subject: "Email Verification",
      text: "Please verify your email by clicking the link below:",
      html: `<a href="http://localhost:8000/auth/verify/${dataToken}">Verify Account</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  },

  changeUsernameEmail: async (dataEmail, changes) => {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "gianslpurwadhika@hotmail.com",
        pass: "gianPurwadhika",
      },
    });

    const mailOptions = {
      from: "gianslpurwadhika@hotmail.com",
      to: dataEmail,
      subject: `${changes} Changed`,
      text: "Thankyou",
      html: `<h1> ${changes} has been changed</h1>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Change data email sent");
    } catch (error) {
      console.error("Error sending change data email:", error);
    }
  },
};

module.exports = SendEmail;
