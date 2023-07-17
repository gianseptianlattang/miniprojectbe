const nodemailer = require("nodemailer");

const SendEmail = {
  registrationEmail: async (dataEmail, dataToken) => {
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
      subject: "Account Verification",
      text: "Please verify your account by clicking the link below:",
      html: `<a href="http://localhost:8000/auth/verify/${dataToken}">Verify Account</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  },
};

module.exports = SendEmail;
