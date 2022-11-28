const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.airline = require('./Airline.model');
db.flight = require('./Flight.model');
db.flightBooking = require('./FlightBooking.model');
db.holidays = require('./Holidays.model');
db.holidaysBooking = require('./HolidaysBooking.model');
db.hotels = require('./Hotels.model');

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
