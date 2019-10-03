let express = require('express');
let router = express.Router();
let sectionController = require('../public/controllers/sectionController');

router.get('/getAll', sectionController.getSections);
router.post('/create', sectionController.insertSection);

module.exports = router;