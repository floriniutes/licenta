let History = require('../models/index').History;


module.exports.insertHistory = (req, res) => {
    History.create({
        section: req.body.section,
        userId: req.body.userId,
        medicId: req.body.medicId,
        date: req.body.date,
        comments: req.body.comments
    }).then((response) => {
        if (response) {
            res.status(200).json({ message: 'Added to history' })
        } else {
            res.status(500).json({ message: 'Server error' })
        }
    })
}

module.exports.getAllMedicHistories = (req, res) => {
    History.findAll({
        where: {
            medicId: req.params.userId
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({message: 'Not found'})
        }
    })
}

module.exports.getAllPatientHistories = (req, res) => {
    History.findAll({
        where: {
            userId: req.params.userId
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({message: 'Not found'})
        }
    })
}

module.exports.getPatientMedicHistories = (req, res) => {
    History.findAll({
        where: {
            userId: req.body.patientId,
            medicId: req.body.medicId,
            section: req.body.section
        }
    }).then(response => {
        res.status(200).json(response);
    })
}