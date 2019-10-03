let express = require('express');
let notificationController = require('../public/controllers/notificationController');
let router = express.Router();

router.get('/getUserNotifications/:userId', notificationController.getUserNotifications);
router.post('/createRescheduleNotif', notificationController.createRescheduleNotification);
router.post('/create', notificationController.createUserNotification);
router.get('/countNotifications/:userId', notificationController.countNewNotifications);
router.put('/markAsOld/:userId', notificationController.markNewNotificationsAsOld);
router.put('/updateNotification/:id', notificationController.updatedNotification);
router.post('/createCancelAllNotification', notificationController.createNotificationForCancelled);

module.exports = router;