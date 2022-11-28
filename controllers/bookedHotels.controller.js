const BookedHotelsModel = require('../models/bookedHotels.model')
const hotelsModel = require('../models/Hotels.model')
const UserModel = require('../models/user.model')
const ObjectId = require('mongoose').Types.ObjectId
let db = require('../models');
let TouristDB = db.user;
var nodemailer = require('nodemailer');
let config = require('../config/mailer.config')

// get all booked hotels
exports.getAll = async (req, res) => {
    await BookedHotelsModel.find({}).populate('Hotels').populate("Tourist", "-password").exec((err, hotels) => {
        (!err) ? res.send(hotels)
            : console.log('error in get all hotels: ' + JSON.stringify(err, undefined, 2))
    })
}


//get hotel by id
exports.getHotelById = async (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No Bookedhotel given id :  ${req.params.id}`);

    await BookedHotelsModel.findById(req.params.id).populate('Hotels').populate("Tourist", "-password").exec((err, hotel) => {
        (!err) ? res.send(hotel)
            : console.log('error in get booked hotel by id : ' + JSON.stringify(err, undefined, 2))

    })
}


// post new hotel
exports.postBookedHotel = async (req, res) => {

    const hotel = new BookedHotelsModel({
        // RoomCount: req.body.roomCount,
        AdultCount: req.body.adultCount,
        Child: req.body.child,
        // Period: req.body.period,
        Single: req.body.single,
        Double: req.body.double,
        IsApprove: req.body.isApprove,
        Paid:req.body.paid,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Hotels: req.body.hotels,
        Tourist: req.body.tourist,
        // Guide: req.body.guide

    })
    
    const Tourist = await TouristDB.findById(req.body.tourist).exec()
    // Config Email 
    var mailConfigurations = {
        from: 'traveasycompany@gmail.com',
        to: Tourist.email,
        subject: 'booking confirmed',
        html: `<h2>Hi! ${Tourist.firstName} ${Tourist.lastName}</h2> 
        <h5> booking confirmed.</h5>
        <p>Approve : ${hotel.IsApprove ? 'yes' : 'no'} </p>
        <p>Paid : ${hotel.Paid} </p>

        <p>RoomCount : ${hotel.Single + hotel.Double} </p>
        <p>start date : ${hotel.startDate } </p>
        <p>end date : ${hotel.endDate } </p>`
    };

    config.transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) return console.log(error);
        console.log('Email Sent Successfully');
        console.log(info);
    })
   
   
    await hotel.save((err, hotel) => {
        (!err) ? res.send(hotel)
            : console.log('error in post bookedHotel: ' + JSON.stringify(err, undefined, 2))

    })
}

// edit booked hotel
exports.editBookedHotel = async(req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No hotel given id :  ${req.params.id}`);

    var hotel = {
        // RoomCount: req.body.roomCount,
        AdultCount: req.body.adultCount,
        Child: req.body.child,
        // Period: req.body.period,
        Single: req.body.single,
        Double: req.body.double,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        IsApprove: req.body.isApprove,
        Paid:req.body.paid,
        Hotels: req.body.hotels,
        Tourist: req.body.tourist,
        // Guide: req.body.guide

    }

    const Tourist = await TouristDB.findById(req.body.tourist).exec()
    
    // Config Email 
    var mailConfigurations = {
        from: 'traveasycompany@gmail.com',
        to: Tourist.email,
        subject: 'booking updated',
        html: `<h2>Hi! ${Tourist.firstName} ${Tourist.lastName}</h2> 
        <h5> Your booking status has been updated.</h5>
        <p>Approve : ${hotel.IsApprove ? 'yes' : 'no'} </p>
        <p>Paid : ${hotel.Paid} </p>

        <p>RoomCount : ${hotel.Single + hotel.Double} </p>
        <p>start date : ${hotel.startDate } </p>
        <p>end date : ${hotel.endDate } </p>`
    };

    config.transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) return console.log(error);
        console.log('Email Sent Successfully');
        console.log(info);
    })


    BookedHotelsModel.findByIdAndUpdate(req.params.id, { $set: hotel }, { new: true },
        (err, hotel) => {
            (!err) ? res.send(hotel)
                : console.log('error in update bookedhotel: ' + JSON.stringify(err, undefined, 2))
        })
}





// delete one hotel by id
exports.deleteBookedHotel = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No hotel with given id :  ${req.params.id}`);

    BookedHotelsModel.findByIdAndRemove(req.params.id, (err, hotel) => {
        (!err) ? res.send(hotel)
            : console.log('error in delete hotel: ' + JSON.stringify(err, undefined, 2))
    })
}


//  filterations:

//get bookedHotels by date
exports.getBookedByDate = async (req, res) => {

    try {
        //get dates from req.query 
        let { startDate, endDate } = req.query;

        //1. check that date is not empty
        if (startDate === '' || endDate === '') {
            return res.status(400).json({
                status: 'failure',
                message: 'Please ensure you pick two dates'
            })
        }
        //3. Query database using Mongoose
        const BookedModels = await BookedHotelsModel.find({
            //find models that it's startDate is more than given startDate & it's endDate is less than given endDate  
            $and: [
                {
                    startDate:
                    {
                        $gt: new Date(new Date(startDate).setHours(00, 00, 00))
                    }
                }, {
                    endDate: {
                        $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                    }
                }]
        }).populate('Hotels').populate("Tourist", "-password").exec()

        //4. Handle responses
        if (!BookedModels) {
            return res.status(404).json({
                status: 'failure',
                message: 'Could not retrieve BookedModels'
            })
        }
        res.status(200).json(BookedModels)

    } catch (error) {
        return res.status(500).json({
            status: 'failure',
            error: error.message
        })
    }
}

// calc total price
exports.getAggr = async (req, res) => {

    let query = {};
    let price = {};
    let { id } = req.query;

    // get selected Bookedhotel 
    let booked = await BookedHotelsModel.findById(id).select('Hotels').exec()
    query = booked.Hotels

    // get selected hotel id
    let hotels = await hotelsModel.findById(query).exec()

    // get price value
    price = hotels.Price

    //  aggregate to sum multiply of (price * Period * RoomCount) to get total price
    await BookedHotelsModel.aggregate(
        [
            {
                $match:
                    { _id: ObjectId(id) }
            },

            {
                $group: {
                    _id: null,
                    // price * Period * RoomCount
                    totalAmount: { $sum: { $multiply: ["$RoomCount", "$Period", price] } },
                }

            },
        ]
    )
        .then(response => {
            res.status(200).send(response)
        }).catch(e => res.status(400).send())

}


// get BookedHotels by userName
exports.getByUserName = async (req, res) => {
    let query = {};

    // Check for Tourist Ref
    if (req.query.user) {
        console.log(req.query.user);
        const TouristSearch = await UserModel.findOne(
            { "username": { $regex: new RegExp(req.query.user, "i") } }
        )
        try {
            query.Tourist = TouristSearch._id
        }
        catch {
            console.log('This user has not booked hotels any')
        }
    }
    try {
        let bookedHotels = await BookedHotelsModel.find(query).populate('Hotels').exec()
        res.send(bookedHotels)
    } catch (error) {
        res.status(404).json(error.message)
    }
}
