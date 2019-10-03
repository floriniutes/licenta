const nodemailer = require("nodemailer");
let crypto = require('crypto')
const User = require('../models/index').User;

module.exports.recover = async (req, res) => {

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(response => {
        if (response) {
            let newPassword = crypto.randomBytes(10).toString('hex');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'georgefloriniutes@gmail.com',
                    pass: "parolalicenta"
                }
            });

            const mailOptions = {
                from: 'georgefloriniutes@gmail.com',
                to: req.body.email,
                subject: 'Resetare parolă',
                html: `<p>Noua parolă: ${newPassword} </p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            })

            response.update({ password: newPassword });

            if (!response.dataValues.isActive) {
                response.update({ isActive: 1 })
                res.status(202).json({ message: 'Account reactivated and new password sent' })
            } else {
                res.status(200).json({ message: 'New password sent' });
            }
        } else {
            res.status(201).json({ message: 'User not registered' })
        }
    })
}