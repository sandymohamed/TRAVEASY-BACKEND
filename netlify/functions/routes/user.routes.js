const { authJwt } = require('../middlewares');
const controller = require('../controllers/user.controller');
const { verifySignUp } = require('../middlewares');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.get('/test/all', controller.allAccess);
  app.get('/test/user', [authJwt.verifyToken], controller.userBoard);
  app.get('/test/mod', [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);
  app.get('/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
  app.get('/admin/users', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);
  app.get('/admin/users/filter', [authJwt.verifyToken, authJwt.isAdmin], controller.FilterUsers);
  app.delete('/admin/users/remove/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
  app.get('/admin/statistics', [authJwt.verifyToken, authJwt.isAdmin], controller.statistics);
  app.patch('/user/edit/:id', [authJwt.verifyToken], controller.editUserProfile);
};
