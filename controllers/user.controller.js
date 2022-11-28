let db = require('../models');
let UsersDB = db.user;
let RolesDB = db.role;
let AirlineDB = db.airline;
let FlightDB = db.flight;
let FlightBookingDB = db.flightBooking;
let BookedHolidaysModel = require('../models/HolidaysBooking.model');
let BookedHotelsModel = require('../models/bookedHotels.model');
let CityModel = require('../models/City.model');
let FeedbackModel = require('../models/feedback.model');
let HotelModel = require('../models/Hotels.model');

let bcrypt = require('bcryptjs');

exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.');
};

exports.userBoard = (req, res) => {
  res.status(200).send('User Content.');
};

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send('Moderator Content.');
};

// Filter users & search user
exports.FilterUsers = async (req, res) => {
  let query = {};
  // get page
  const page = req.query.page ? req.query.page - 1 : 0;
  if (req.query.email) {
    query.email = req.query.email;
  }
  if (req.query.firstName) {
    query.firstName = req.query.firstName;
  }
  if (req.query.lastName) {
    query.lastName = req.query.lastName;
  }
  if (req.query.birthday) {
    query.birthday = req.query.birthday;
  }
  if (req.query.username) {
    query.username = req.query.username;
  }
  if (req.query.role) {
    query.role = req.query.role;
  }
  try {
    // Check Search for Role Ref
    if (req.query.role) {
      const usersByRole = await RolesDB.find({
        role: { $regex: new RegExp(req.query.role, 'i') },
      });
      res.status(200).send(usersByRole);
    }

    const users = await UsersDB.find(query).skip(page).limit(5).populate('roles').exec();
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json(error.message);
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const usersList = await UsersDB.find({}).populate('roles').exec();
    res.status(200).send(usersList);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.editUserProfile = async (req, res) => {
  let { username, email, password, firstName, lastName, country, birthday, oldPassword } = req.body;
  const _id = req.params.id;
  let userObj = {
    username: username,
    email: email,
    password: password ? bcrypt.hashSync(password, 8) : undefined,
    firstName: firstName,
    lastName: lastName,
    country: country,
    birthday: birthday,
  };
  try {
    UsersDB.findById({ _id }).populate('roles', '-__v').exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      var oldPasswordIsValid = bcrypt.compareSync(oldPassword, user.password)
      if (!oldPasswordIsValid) {
        return res.status(401).send({ message: 'Invalid Old Password!' })
      }
      const updatedUser = UsersDB.findByIdAndUpdate(_id, { $set: userObj }, { new: true }).populate('roles').exec().then(() => {
        res.status(200).send(updatedUser);
      }).catch((err) => {
        if (err.message.indexOf("11000") != -1) {
          res.status(409).send({ message: 'Duplicate! username or email is exist!' })
        }
      })
    })

  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  const _id = req.params.id;
  try {
    await UsersDB.findByIdAndRemove({ _id });
    res.status(200).json('Removed Successfuly');
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.statistics = async (req, res) => {
  try {
    let usersCount = await UsersDB.find({}).count();
    let airlineCount = await AirlineDB.find({}).count();
    let flightCount = await FlightDB.find({}).count();
    let flightBookingCount = await FlightBookingDB.find({}).count();
    let bookedHolidaysCount = await FlightBookingDB.find({}).count();
    let bookedHotels = await BookedHotelsModel.find({}).count();
    let hotelCount = await HotelModel.find({}).count();
    let feedbackCount = await FeedbackModel.find({}).count();
    let cityCount = await CityModel.find({}).count();
    let bookedHolidaysModel = await BookedHolidaysModel.find({}).count();

    res.status(200).json({
      usersCount: usersCount,
      airlineCount: airlineCount,
      flightCount: flightCount,
      flightBookingCount: flightBookingCount,
      bookedHolidaysCount: bookedHolidaysCount,
      bookedHotels: bookedHotels,
      hotelCount: hotelCount,
      feedbackCount: feedbackCount,
      cityCount: cityCount,
      bookedHolidaysModel: bookedHolidaysModel,
    });
  } catch (error) {
    res.status(404).json(error.message);
  }
};
