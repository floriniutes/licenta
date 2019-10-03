const User = require('../models/index').User;
let crypto = require('crypto')

module.exports.findUser = (req, res) => {
    User.findOne({
        where: {
            isActive: 1,
            email: req.body.email,
            password: req.body.password
        },
        raw: true
    }).then((response) => {
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({ message: "User not found" })
        }
    })
}

module.exports.getAllUsersWithPID = (req, res) => {
    User.findAll({
        where: {
            isActive: 1
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response);
        }
    })
}

module.exports.checkUser = (req, res) => {
    User.findOne({
        where: {
            isActive: 1,
            id: req.body.id,
            token: req.body.token,
            isDoctor: req.body.isDoctor,
            isAssistant: req.body.isAssistant
        }
    }).then(response => {
        if (response) {
            res.status(200).json({ message: "User exists" });
        } else {
            res.status(201).json({ message: "User doesn't exist" });
        }
    })
}

module.exports.getOneUser = (req, res) => {
    User.findAll({
        where: {
            isActive: 1,
            id: req.params.userId
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response)
        }
    })
}

module.exports.getUserName = (req, res) => {
    User.findAll({
        attributes: ["firstName", "lastName"],
        where: {
            isActive: 1,
            id: req.params.userId
        }
    }).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    })
}

module.exports.findAll = (req, res) => {
    User.findAll().then((response) => {
        if (response) {
            res.status(200).send(response)
        } else {
            res.status(404).json({ message: 'No users' })
        }
    })
}

module.exports.updateUser = (req, res) => {
    User.update(req.body, {
        where: {
            isActive: 1,
            id: req.params.userId
        }
    }).then(response => {
        if (response) {
            res.status(200).json({ message: 'Update succeeded' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    })
}

module.exports.insertUser = (req, res, next) => {
    User.findOne({
        where: {
            isActive: 1,
            pid: req.body.pid.value
        },
        raw: true
    }).then((response) => {
        if (response) {
            res.status(201).json({ message: "User with this PID already registered" });
        } else {
            let token = crypto.randomBytes(64).toString('hex');
            User.create({
                firstName: req.body.firstName.value,
                lastName: req.body.lastName.value,
                token: token,
                pid: req.body.pid.value,
                email: req.body.email.value,
                password: req.body.password.value,
                phoneNumber: req.body.phoneNumber.value,
                isDoctor: 0,
                isActive: 1,
                isAssistant: 0
            })
            res.status(200).json({ message: "User registered" })
        }
    })
}

module.exports.getAllMedics = (req, res) => {
    User.findAll({
        where: {
            isActive: 1,
            isDoctor: 1
        }
    }).then((response) => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404);
        }
    })
}

module.exports.getAllMedicsByAvailability = (req, res) => {
    if (req.body.listOfIds) {
        User.findAll({
            where: {
                id: req.body.listOfIds,
                isDoctor: 1,
                isActive: 1
            },
            raw: true
        }).then((response) => {
            if (response) {
                res.status(200).json(response)
            } else {
                res.status(404);
            }
        })
    }
}

module.exports.getUserData = (req, res) => {
    User.findOne({
        where: {
            isActive: 1,
            id: req.session.userId
        }
    }).then((response) => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404);
        }
    })
}

module.exports.deactivateAccount = (req, res) => {
    User.findOne({
        where: {
            isActive: 1,
            id: req.params.userId
        }
    }).then((response) => {
        if (response) {
            response.update({isActive: 0});
            res.status(200).json({ message: 'Updated' })
        } else {
            res.status(404);
        }
    })
}

module.exports.updateUserData = (req, res) => {
    User.findOne({
        where: {
            isActive: 1,
            id: req.body.userId
        }
    }).then((response) => {
        if (response) {
            response.update(req.body);
            res.status(200).json({ message: 'Updated' })
        } else {
            res.status(404);
        }
    })
}