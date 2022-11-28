const ObjectId = require('mongoose').Types.ObjectId
const FeedbackModel = require('../models/feedback.model')
const HotelModel = require('../models/Hotels.model')


exports.getAll = async (req, res) => {
    await FeedbackModel.find({}).populate("Hotels").populate("Tourist", "-password").exec((err, feedback) => {
        (!err) ? res.send(feedback)
            : console.log('error in get feedback by id : ' + JSON.stringify(err, undefined, 2))

    })
}


exports.getByHotelID = async (req, res) => {
    let query = {};

   // Check for Search City Ref
   if (req.query.hotelid) {
    const HotelSearch = await HotelModel.findOne(
        { "_id":(req.query.hotelid)  }
    )

    try {
        query.Hotels = HotelSearch
    }
    catch {
        console.log('No feedback for this hotel')
    }
}

try {
    let feedbacks = await FeedbackModel.find(query).populate('Hotels').populate("Tourist", "-password").exec()
    res.send(feedbacks)

} catch (error) {
    res.status(404).json(error.message)
}
}

// get hotel feedback
exports.getByHotelName = async (req, res) => {
    let query = {};

    // Check for Search City Ref
    if (req.query.hotel) {
        const HotelSearch = await HotelModel.findOne(
            { "HotelName": { $regex: new RegExp(req.query.hotel, "i") } }
        )

        try {
            query.Hotels = HotelSearch._id
        }
        catch {
            console.log('No feedback for this hotel')
        }
    }

    try {
        let feedbacks = await FeedbackModel.find(query).populate('Hotels').populate("Tourist", "-password").exec()
        res.send(feedbacks)

    } catch (error) {
        res.status(404).json(error.message)
    }
}


exports.postFeedback = async(req, res)=> {
    const feedback = new FeedbackModel({
        Hotels: req.body.hotels,
        Tourist: req.body.tourist,
        Description: req.body.description,

    })
    await feedback.save((err, feedback)=> {
        (!err) ? res.send(feedback) 
        : console.log('error in post feedback: ' + JSON.stringify(err, undefined, 2))

    }) 
}

// delete feedback by id
exports.deleteFeedback = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No feedback with given id :  ${req.params.id}`);

    FeedbackModel.findByIdAndRemove(req.params.id, (err, feedback) => {
        (!err) ? res.send(feedback)
            : console.log('error in delete feedback: ' + JSON.stringify(err, undefined, 2))
    })
}


