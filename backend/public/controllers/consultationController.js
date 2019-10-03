const Consultation = require('../models/index').Appointment;
const Notification = require('../models/index').Notification;
const Section = require('../models/index').Section;
const Availability = require('../models/index').Availability;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.findAllUserAppointments = (req, res) => {
    Consultation.findAll({
        where: {
            userId: req.params.userId,
            completed: 0,
            abandoned: 0
        },
        order: [['date', 'ASC'], ['time', 'ASC']]
    }).then((response) => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404);
        }
    })
}

module.exports.findRescheduleAppointment = (req, res) => {
    Consultation.findAll({
        where: {
            completed: 0,
            abandoned: 0,
            medicId: req.body.medicId,
            date: req.body.date,
            section: req.body.section,
            time: req.body.time
        }
    }).then(response => {
        if (response.length > 0) {
            res.status(201).json({ message: 'Someone has already occupied that' })
        } else {
            res.status(200).json(response)
        }
    })
}

module.exports.findAllMedicAppointments = (req, res) => {
    Consultation.findAll({
        where: {
            completed: 0,
            abandoned: 0,
            medicId: req.params.medicId
        },
        order: [['date', 'ASC'], ['time', 'ASC']]
    }).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "Not found" })
        }
    })
}

module.exports.getAllAppointmentsByDate = (req, res) => {
    Consultation.findAll({
        attributes: ["time"],
        where: {
            date: req.body.date,
            abandoned: 0,
            completed: 0
        },
        order: [['time', 'ASC']]
    }).then((response) => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404);
        }
    })
}

module.exports.abandonAppointment = (req, res) => {
    Consultation.update(
        { abandoned: 1 },
        {
            where: { id: req.body.id },
        }).then(response => {
            if (response) {
                res.status(200).json(response);
            }
        })
}

module.exports.abandonAllAppointmentsByDate = (req, res) => {
    Consultation.update(
        { abandoned: 1 },
        {
            where: {
                completed: 0,
                date: req.body.date
            }
        }
    ).then((response) => {
        if (response) {
            res.status(200).json({ message: 'Programari anulate' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    })
}

module.exports.rescheduleAppointment = (req, res) => {
    Consultation.findAll({
        where: {
            id: req.body.resData.id,
            completed: 0,
            abandoned: 0,
            medicId: req.body.resData.medicId,
            userId: req.body.resData.userId,
            section: req.body.resData.section,
            date: req.body.resData.date,
            time: req.body.resData.time
        }
    }).then((response) => {
        if (response) {
            Consultation.update({
                abandoned: 1
            }, {
                    where: {
                        id: req.body.resData.id,
                        completed: 0
                    }
                }).then((result) => {
                    if (result) {
                        res.status(200).json({ message: 'Reprogramat' })
                    } else {
                        res.status(500).json({ message: 'Error' })
                    }
                })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    })
}

module.exports.completeAppointment = (req, res) => {
    Consultation.update(
        { completed: 1 },
        {
            where: {
                id: req.body.id,
                abandoned: 0
            }
        }
    ).then(response => {
        if (response) {
            res.status(200).json({ message: 'Completed' })
        } else {
            res.status(500).json({ message: 'Server error' })
        }
    })
}

module.exports.createMockAppointment = (req, res) => {
    Consultation.create({
        userId: 1,
        medicId: 2,
        completed: 0,
        abandoned: 0,
        section: null,
        dateTime: req.body.dateTime,
        time: null,
        duration: 10
    }).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(500).json({ message: 'not okay' })
        }
    })
}

module.exports.rescheduleAndAbandon = (req, res) => {
    Consultation.findAll({
        where: {
            userId: req.body.data.userId,
            medicId: req.body.data.medicId,
            completed: 0,
            abandoned: 0,
            section: req.body.data.section,
            date: req.body.data.date,
            time: req.body.data.time,
            duration: req.body.data.duration
        }
    }).then(firstResponse => {
        if (firstResponse.length > 0) {
            res.status(300).json({ message: 'Someone has already registered for this' })
        } else {
            Consultation.create({
                userId: req.body.data.userId,
                medicId: req.body.data.medicId,
                completed: 0,
                abandoned: 0,
                section: req.body.data.section,
                date: req.body.data.date,
                time: req.body.data.time,
                duration: req.body.data.duration
            }).then(secondResponse => {
                if (secondResponse) {
                    Consultation.findAll({
                        where: {
                            userId: req.body.data.userId,
                            medicId: req.body.data.medicId,

                            completed: 0,
                            abandoned: 0,
                            section: req.body.data.section
                        }
                    }).then(result => {
                        if (result) {
                            let max = result[0].dataValues.date;
                            let poz = 0;
                            for (let i = 1; i < result.length; i++) {
                                if (max < result[i].dataValues.date) {
                                    max = result[i].dataValues.date;
                                    poz = i;
                                }
                            }
                            Consultation.update({
                                abandoned: 1
                            }, {
                                    where: {
                                        userId: result[poz].dataValues.userId,
                                        medicId: result[poz].dataValues.medicId,
                                        completed: 0,
                                        abandoned: 0,
                                        section: result[poz].dataValues.section,
                                        date: result[poz].dataValues.date,
                                        time: result[poz].dataValues.time,
                                        duration: result[poz].dataValues.duration
                                    }
                                }).then(finalResult => {
                                    if (finalResult) {
                                        res.status(200).json(finalResult);
                                    }
                                })
                        } else {
                            res.status(404).json({ message: 'Not found' })
                        }
                    })
                }
            })
        }
    })
}

module.exports.createAppointment = (req, res) => {
    Consultation.findAll({
        where: {
            userId: req.body.data.userId,
            medicId: req.body.data.medicId,
            completed: 0,
            abandoned: 0,
            section: req.body.data.section,
            date: req.body.data.date,
            time: req.body.data.time,
            duration: req.body.data.duration
        }
    }).then(response => {
        if (response.length > 0) {
            res.status(201).json({ message: 'Someone has already registered for this' })
        } else {
            Consultation.create({
                userId: req.body.data.userId,
                medicId: req.body.data.medicId,
                completed: 0,
                abandoned: 0,
                section: req.body.data.section,
                date: req.body.data.date,
                time: req.body.data.time,
                duration: req.body.data.duration
            }).then((response) => {
                if (response) {
                    res.status(200).json({ messasge: 'Appointment registered' })
                } else {
                    res.status(500).json({ message: 'There has been an error' })
                }
            })
        }
    })
}

function getNextWeek(date) {
    let fullDate = new Date(date);
    fullDate = new Date(fullDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    let day = parseInt(fullDate.getDate()) < 10 ? '0' + fullDate.getDate() : fullDate.getDate();
    let month = (fullDate.getMonth() + 1) < 10 ?
        '0' + (fullDate.getMonth() + 1) : (fullDate.getMonth() + 1);

    let formatedDate = fullDate.getFullYear() + '-' + month + '-' + day;

    return formatedDate;
}

function todayFormatDate() {
    let date = new Date();
    let day = parseInt(fullDate.getDate()) < 10 ? '0' + fullDate.getDate() : fullDate.getDate();
    let month = (fullDate.getMonth() + 1) < 10 ?
        '0' + (fullDate.getMonth() + 1) : (fullDate.getMonth() + 1);

    let formatedDate = fullDate.getFullYear() + '-' + month + '-' + day;

    return formatedDate;
}

function generateTimeList(startTime, endTime, duration) {
    let timesList = [];

    let currentTime = "00:00";

    while (currentTime <= endTime) {
        if (currentTime >= startTime) {
            timesList.push(currentTime);
        }

        let minutes = parseInt(currentTime.split(':')[1]);
        let hours = parseInt(currentTime.split(':')[0]);
        if (minutes + duration >= 60) {
            hours += 1;
            minutes = minutes + duration - 60;
        } else {
            minutes = minutes + duration;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (hours < 10) {
            hours = "0" + hours;
        }

        currentTime = hours + ":" + minutes;
    }

    return timesList;
}

module.exports.reschedulePatients = async (req, res) => {

    let consultations = await Consultation.findAll({ where: { abandoned: 0, completed: 0, medicId: req.body.medicId, date: req.body.date } });
    let section = await Section.findAll({ where: { name: consultations[0].section } });
    let availability = await Availability.findOne({ where: { userId: req.body.medicId, sectionId: section[0].id } });
    let date = getNextWeek(req.body.date);
    let generatedList = await generateTimeList(availability.startTime, availability.endTime, availability.consultationDuration);
    let finalTime;

    for (let j = 0; j < consultations.length; j++) {
        let ok = 0;

        let text = 'Programarea dumneavoastră de pe data de ' + consultations[j].date + ', secția de ' + consultations[j].section + ', a fost mutată pe data de ';

        while (ok === 0) {

            let existingTimes = [];

            existingConsultations = await Consultation.findAll({ where: { abandoned: 0, completed: 0, medicId: req.body.medicId, date: date, } });

            if (existingConsultations.length > 0) {
                for (let k = 0; k < existingConsultations.length; k++) {
                    existingTimes.push(existingConsultations[k].time);
                }
            }

            if (existingTimes.indexOf(consultations[j].time) === -1) {
                finalTime = consultations[j].time;
                ok = 1;
            } else {
                for (let m = 0; m < generatedList.length; m++) {
                    if (existingTimes.indexOf(generatedList[m]) === -1) {
                        finalTime = generatedList[m];
                        ok = 1;
                    }
                    if (ok === 1) {
                        break;
                    }
                }
            }

            if (ok === 0) {
                existingTimes = [];
                date = getNextWeek(date);
            }

            secondExist = existingTimes;
        }

        await Consultation.update({
            date: date,
            time: finalTime
        }, {
                where: {
                    id: consultations[j].id,
                }
            });

        text += date + ', ora: ' + finalTime;

        let today = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();

        Notification.create({
            isNew: true,
            date: today,
            userId: consultations[j].userId,
            text: text
        })
    }
    res.status(200);
}
