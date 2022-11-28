const express = require('express')
const router = express.Router();
const {authJwt} = require('../middlewares')

const {getAll, postCity, deleteCity} = require('../controllers/city.controller')

router.get('/', getAll)

router.post('/',[authJwt.verifyToken, authJwt.isAdmin], postCity)

router.delete('/:id',[authJwt.verifyToken, authJwt.isAdmin], deleteCity)

module.exports = { cityRouter: router };