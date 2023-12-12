// external imports
require("dotenv").config();
const nodemailer = require('nodemailer');

// internal imports
const {
    MAILER_HOST,
    MAILER_USERNAME,
    MAILER_PASSWORD,
} = require("../env");

// auth middleware
const mail_re = async (mailOptions) => {

    let transporter = nodemailer.createTransport({
        host: MAILER_HOST,
        // host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: MAILER_USERNAME,
            pass: MAILER_PASSWORD,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
            transporter.sendMail(mailOptions, function async(error, info) {
                if (error) {
                    console.log(error, 'mail');
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
}

module.exports = mail_re;
