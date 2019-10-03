let express = require('express');
let router = express.Router();
let User = require('./user');
let Auth = require('./authentication');
let History = require('./history');
let Availability = require('./availability');
let Consultation = require('./consultation');
let Notification = require('./notification');
let Section = require('./section');

router.use('/user', User);
router.use('/section', Section);
router.use('/notification', Notification);
router.use('/history', History);
router.use('/availability', Availability)
router.use('/consultation', Consultation)
router.use('/auth', Auth)
module.exports = router;