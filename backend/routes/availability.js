let express = require('express');
let availability = require('../public/controllers/availability');
let router = express.Router();

router.get('/getAll/:sectionId', availability.getAll);
router.post('/create', availability.insert)

module.exports = router;