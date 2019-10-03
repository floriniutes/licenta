const Section = require('../models/index').Section;

module.exports.getSections = (req, res) => {
    Section.findAll({ attributes: ['id', 'name'] }).then((response) => {
        if (response) {
            res.status(200).json(response);
        }
        else {
            res.status(400).json({ message: 'No section found' })
        }
    })
}

module.exports.insertSection = (req, res) => {
    Section.findOne({
        where: {
            name: req.body.name
        },
        raw: true
    }).then((response) => {
        if (response) {
            res.status(201).json({message: 'This section already exists'})
        }else{
            Section.create({
                name: req.body.name
            })
            res.status(200).send({message: 'Section created'})
        }
    })
}