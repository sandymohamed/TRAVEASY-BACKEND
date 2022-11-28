const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });
  app.post(
    '/auth/signup',
    [verifySignUp.checkDublicate, verifySignUp.checkExistedRole],
    controller.signup
  );
  app.post('/auth/signin', controller.signin);
  app.post('/auth/signout', controller.signout);
};
