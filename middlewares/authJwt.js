let jwt = require('jsonwebtoken');
let config = require('../config/auth.config');
let { role } = require('../models');
let db = require('../models');
let User = db.user;
let Role = db.role;

// check if token is provided, legal or not
verifyToken = (req, res, next) => {
  // access token from header request
  let token = req.headers['x-access-token'] || req.session.token;
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.headers.userid = decoded.id;
    next();
  });
};

// check if roles of the user contain required role or not

isAdmin = (req, res, next) => {
  User.findById(req.headers.userid).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      for (role of roles) {
        if (role.name === 'admin') {
          next();
          return;
        }
      }
      res.status(403).send({ message: 'Require Admin Role!' });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findById(req.headers.userid).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {

      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      for (role of roles) {
        if (role.name === 'moderator') {
          next();
          return;
        }
      }
      res.status(403).send({ message: 'Require Moderator Role!' });
      return;
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
