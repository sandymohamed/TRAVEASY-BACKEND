const express = require('express')
const router = express.Router();
const {authJwt} = require('../middlewares')

const { getAll,getLimit ,postHoliday, deleteholiday, getById, editHoliday, getHolidaysByEvaluation, getByCity, getHolidayssByPrice } = require('../controllers/holidays.controller')

router.get('/', getAll)

router.get('/limit', getLimit)

router.get('/rate', getHolidaysByEvaluation)

router.get('/city', getByCity)

router.get('/price', getHolidayssByPrice)


router.get('/:id', getById)

// router.post('/',[authJwt.verifyToken] , postHoliday)
router.post('/',[authJwt.verifyToken , authJwt.isModerator], postHoliday)

// router.put('/:id',[authJwt.verifyToken] , editHoliday)
router.put('/:id',[authJwt.verifyToken , authJwt.isModerator], editHoliday)

router.delete('/:id',[authJwt.verifyToken ,  authJwt.isModerator] , deleteholiday)

module.exports = { holidaysRouter: router };