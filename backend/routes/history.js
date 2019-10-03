let express = require('express');
let router = express.Router();
let historyController = require('../public/controllers/historyController');

router.post('/create', historyController.insertHistory);
router.get('/getAllMedicHistories/:userId', historyController.getAllMedicHistories);
router.get('/getAllPatientHistories/:userId', historyController.getAllPatientHistories);
router.post('/getPatientHistories', historyController.getPatientMedicHistories);

module.exports = router;