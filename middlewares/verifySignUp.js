const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
/* Verify a Signuo action, 
check dublication for username and email,
check if roles in the request is legal or not
*/

checkDublicate = (req, res, next) => {
  const { username, email } = req.body;
  // Username
  User.findOne({
    username: username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: 'Failed! Username is already in use!' });
      return;
    }
    User.findOne({
      email: email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: 'Failed! Email is already in use!' });
        return;
      }
      next();
    });
  });
};

checkExistedRole = (req, res, next) => {
  const { roles } = req.body;
  if (roles) {
    for (role of roles) {
      if (!ROLES.includes(role)) {
        res.status(400).send({ message: `Failed! Role ${role} does not exist!` });
        return;
      }
    }
  }
  next();
};
const verifySignUp = {
  checkExistedRole,
  checkDublicate,
};
module.exports = verifySignUp;
