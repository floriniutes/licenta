let express = require('express');
let authentication = require('../public/controllers/authentication');
let router = express.Router();

router.post('/auth', authentication.authentication)

module.exports = router;