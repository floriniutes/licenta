let sequelize = require('./database');
let User = sequelize.import('./user');
let Availability = sequelize.import('./availability');
let History = sequelize.import('./history');
let Appointment = sequelize.import('./consultation');
let Notification = sequelize.import('./notification');
let Section = sequelize.import('./section');

User.hasMany(Availability, {onDelete:'cascade'});
User.hasMany(History, {onDelete:'cascade', as:'patientHistory'});
User.hasMany(History, {onDelete:'cascade', as:'medicHistory'});
User.hasMany(Appointment, {onDelete:'cascade', as:'patientAppointment'});
User.hasMany(Appointment, {onDelete: 'cascade', as:'medicAppointment'});
User.hasMany(Notification, {onDelete:'cascade'});

Appointment.belongsTo(User, {onDelete:'cascade', as:'medic'});
History.belongsTo(User, {onDelete:'cascade', as:'medic'});
Availability.belongsTo(Section, {onDelete:'cascade', as:'section'});


module.exports = {
	sequelize,
	User,
    Section,
	Availability,
    Appointment,
	History,
	Notification
};