let express = require('express');
let consultation = require('../public/controllers/consultationController');
let router = express.Router();

router.get('/getPatientAppointments/:userId', consultation.findAllUserAppointments);
router.get('/getMedicAppointments/:medicId', consultation.findAllMedicAppointments);
router.post('/rescheduleAppointment', consultation.rescheduleAppointment);
router.put('/abandonAppointment', consultation.abandonAppointment);
router.put('/abandonAllAppointmentsByDate', consultation.abandonAllAppointmentsByDate);
router.post('/getAllByDate', consultation.getAllAppointmentsByDate);
router.put('/completeAppointment', consultation.completeAppointment);
router.post('/rescheduleNewPerson', consultation.findRescheduleAppointment);
router.post('/rescheduleAndAbandon', consultation.rescheduleAndAbandon);
router.put('/reschedulePatients', consultation.reschedulePatients);
router.post('/create', consultation.createAppointment);

module.exports = router;