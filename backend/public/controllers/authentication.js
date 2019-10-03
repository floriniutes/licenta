let User = require('../models/index').User;


module.exports.authentication = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        },
        raw: true
    }).then((response) => {
        if (response) {
            if (response.isActive === 0) {
                User.update({ isActive: 1 },
                    {
                        where: {
                            email: req.body.email,
                            password: req.body.password
                        }
                    }
                );
                res.status(202).json({ message: 'Reactivated' })
            } else {
                res.status(200).json(response);
            }
        } else {
            res.status(201).send({ message: 'No user with these credentials' });
        }
    })
}

module.exports.check = (req, res) => {
    res.status(200).json(req.session);
}