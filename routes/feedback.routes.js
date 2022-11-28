const express = require('express')
const router = express.Router();

const {authJwt} = require('../middlewares')
const {getAll,getByHotelName, postFeedback, deleteFeedback, getByHotelID} = require('../controllers/feedback.controller')

router.get('/', getAll)

// get feedbacks by hotelName
router.get('/hotel',getByHotelName)


// get feedbacks by hotelId
router.get('/hotelid',getByHotelID)

router.post('/', [authJwt.verifyToken] , postFeedback)
// router.post('/',  postFeedback)

router.delete('/:id', deleteFeedback)

module.exports = { FeedbackRouter: router };


