const Notification = require('../models/index').Notification;
const Consultation = require('../models/index').Appointment;
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const Op = Sequelize.Op;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'georgefloriniutes@gmail.com',
        pass: "parolalicenta"
    }
});

module.exports.sendMailNotification = (text, email) => {
    const mailOptions = {
        from: 'georgefloriniutes@gmail.com',
        to: email,
        subject: 'Resetare parolă',
        html: `<p>${text}</p>`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    })
} 

module.exports.getUserNotifications = (req, res) => {
    Notification.findAll({
        where: {
            userId: req.params.userId
        },
        order: [
            ['id', 'DESC'],
        ]
    }).then(response => {
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(201).json({ message: 'Not found' })
        }
    })
}

module.exports.countNewNotifications = (req, res) => {
    Notification.count({
        where: {
            userId: req.params.userId,
            isNew: 1
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(201).json({});
        }
    })
}

module.exports.updatedNotification = (req, res) => {
    Notification.update(
        { additional: null }, {
            where: {
                id: req.params.id
            }
        }).then(response => {
            if (response) {
                res.status(200).json({ message: "Succesfully updated" });
            } else {
                res.status(404).json({ message: 'Not found' })
            }
        })
}

module.exports.createRescheduleNotification = (req, res) => {

    Consultation.findAll({
        where: {
            userId: {
                [Op.not]: req.body.userId
            },
            date: req.body.date,
            medicId: req.body.medicId,
            completed: 0,
            abandoned: 0
        }
    }).then(response => {
        let idsArray = [];
        idsArray.push(req.body.userId);
        for (let i = 0; i < response.length; i++) {
            if (idsArray.indexOf(response[i].userId) === -1) {
                idsArray.push(response[i].userId);
            }
        }

        Consultation.findAll({
            attributes: ["userId"],
            where: {
                userId: {
                    [Op.notIn]: idsArray
                },
                date: {
                    [Op.gt]: req.body.date
                },
                medicId: req.body.medicId,
                section: req.body.section,
                abandoned: 0,
                completed: 0
            }
        }).then(result => {
            if (result) {
                date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
                let uniqueId = [];
                for (let i = 0; i < result.length; i++) {
                    if (uniqueId.indexOf(result[i].userId) === -1) {
                        uniqueId.push(result[i].userId)
                    }
                }

                for (let i = 0; i < uniqueId.length; i++) {
                    Notification.create({
                        userId: uniqueId[i],
                        additional: req.body.additional,
                        text: req.body.text,
                        date: date,
                        isNew: 1
                    })
                }
            }
        })
        res.status(200).json({})
    })
}

module.exports.markNewNotificationsAsOld = (req, res) => {
    Notification.update(
        { isNew: 0 },
        {
            where: {
                userId: req.params.userId,
                isNew: 1
            },
        }).then(response => {
            if (response) {
                res.status(200).json(response);
            } else {
                res.status(500).json({ message: "Server error" })
            }
        })
}

module.exports.createUserNotification = (req, res) => {
    date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    Notification.create({
        userId: req.body.userId,
        text: req.body.text,
        date: date,
        isNew: 1
    }).then(response => {
        res.status(200).json(response);
    })
}

module.exports.createNotificationForCancelled = (req, res) => {

    Consultation.findAll({
        where: {
            date: req.body.date,
            medicId: req.body.medicId,
            abandoned: 0,
            completed: 0
        }
    }).then(response => {
        let uniqueIds = []

        for (let i = 0; i < response.length; i++) {
            if (uniqueIds.indexOf(response[i].userId) === -1) {
                uniqueIds.push(response[i].userId)
            }
        }

        for (let i = 0; i < uniqueIds.length; i++) {
            date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
            Notification.create({
                userId: uniqueIds[i],
                date: date,
                text: req.body.text,
                isNew: 1
            })
        }
    })
}