const Availability = require('../models/index').Availability

module.exports.getAll = (req, res) => {
    Availability.findAll({
        where: {
            sectionId: req.params.sectionId
        }
    }).then((response) => {
        if(response) {
            res.status(200).json(response)
        }else{
            res.status(404);
        }
    })
}

module.exports.insert = (req, res) => {
    Availability.create({
    consultationDay: req.body.consultationDay,
	consultationDuration: req.body.consultationDuration,
	startTime: req.body.startTime,
	endTime: req.body.endTime,
	userId: req.body.userId,
	sectionId: req.body.sectionId
    }).then((response) => {
        if(response) {
            res.status(200).json({message: "Availability added"});
        }else{
            res.status(500).json({message: "There's been an error"});
        }
    })
}