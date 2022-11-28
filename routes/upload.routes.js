const express = require('express');
const router = express.Router();
const { authJwt } = require('../middlewares');

const uploadController = require('../controllers/upload.controller');

const path = require('path');

const uploadViews = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });
  app.get('/images', uploadViews);

  app.post('/upload',  uploadController.uploadFiles);
  app.get('/files',  uploadController.getListFiles);
  app.get('/files/:name', uploadController.download);
  app.get('/img/imgName', uploadController.getImg);

  //return app.use('/', router);
};
