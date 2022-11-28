let config = require('../config/auth.config');
let db = require('../models');
let User = db.user;
let Role = db.role;

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let { role } = require('../models');
/*
There are 3 main functions for Authentication:
- signup: create new User in MongoDB database (role is user if not specifying role)

- signin:
find username of the request in database, if it exists
compare password with password in database using bcrypt, if it is correct
generate a token using jsonwebtoken
return user information & access Token

- signout: clear current session.
*/

const signup = (req, res) => {
  let { username, email, password, roles, firstName, lastName, country, birthday } = req.body;
  let user = new User({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
    firstName: firstName,
    lastName: lastName,
    country: country,
    birthday: birthday,
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (roles) {
      Role.find({ name: { $in: roles } }, (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = roles.map((role) => role._id);
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: 'User was registered successfully!' });
        });
      });
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

const signin = (req, res) => {
  let { username, password } = req.body;

  User.findOne({ username: username })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid Password!' });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      for (role of user.roles) {
        authorities.push('ROLE_' + role.name.toUpperCase());
      }
      req.session.token = token;
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        birthday: user.birthday,
        accessToken: token,
      });
    });
};

const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (error) {
    this.next(error);
  }
};

module.exports = { signin, signup, signout };
