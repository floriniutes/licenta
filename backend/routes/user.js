let express = require('express');
let router = express.Router();
let userController = require('../public/controllers/userController');

router.post('/get', userController.findUser);
router.get('/get/:userId', userController.getOneUser)
router.get('/getName/:userId', userController.getUserName);
router.put('/update/:userId', userController.updateUser);
router.post('/create', userController.insertUser);
router.get('/getAll', userController.findAll)
router.get('/getMedics', userController.getAllMedics);
router.post('/getMedicsByAvailability', userController.getAllMedicsByAvailability);
router.put('/updateData', userController.updateUserData);
router.get('/userData', userController.getUserData);
router.post('/checkUser', userController.checkUser);
router.get('/getAllForPID', userController.getAllUsersWithPID);
router.put('/deactivateAccount/:userId', userController.deactivateAccount);

module.exports = router;