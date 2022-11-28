const express = require('express')
const router = express.Router();
const {authJwt} = require('../middlewares')

const {getAll,getHotelById, postBookedHotel , deleteBookedHotel,editBookedHotel,getByUserName , getBookedByDate, getAggr, getPrice} = require('../controllers/bookedHotels.controller')

// router.get('/',[authJwt.verifyToken] , getAll)
router.get('/', getAll)


// get total price
// router.get('/agg', getAggr)


//get data by date
router.get('/date_range', getBookedByDate )

//get data by user
router.get('/user',[authJwt.verifyToken] , getByUserName )


router.get('/:id',[authJwt.verifyToken] , getHotelById)


router.post('/',[authJwt.verifyToken] , postBookedHotel)


router.put('/:id',[authJwt.verifyToken, authJwt.isModerator] ,editBookedHotel)

router.delete('/:id',[authJwt.verifyToken,  authJwt.isModerator] ,deleteBookedHotel)




module.exports = { bookedHotelsRouter: router };