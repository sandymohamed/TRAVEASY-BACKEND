const BookedHolidaysModel = require('../models/HolidaysBooking.model')
const holidayModel = require('../models/Holidays.model')
const UserModel = require('../models/user.model')
const ObjectId = require('mongoose').Types.ObjectId
let db = require('../models');
let TouristDB = db.user;
var nodemailer = require('nodemailer');
let config = require('../config/mailer.config')


// get all booked holidays
exports.getAll = async (req, res) => {
    await BookedHolidaysModel.find({}).populate('Holidays').populate("Tourist", "-password").exec((err, holidays) => {
        (!err) ? res.send(holidays)
            : console.log('error in get all holidays: ' + JSON.stringify(err, undefined, 2))
    })
}


//get holidy by id
exports.getById = async (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No holiday given id :  ${req.params.id}`);

    await BookedHolidaysModel.findById(req.params.id).populate('Holidays').populate("Tourist", "-password").exec((err, holiday) => {
        (!err) ? res.send(holiday)
            : console.log('error in get booked holiday by id : ' + JSON.stringify(err, undefined, 2))

    })
}


// post new holiday
exports.postBookedHoliday = async (req, res) => {

    const holiday = new BookedHolidaysModel({
        RoomCount: req.body.roomCount,
        AdultCount: req.body.adultCount,
        Child: req.body.child,
        // Period: req.body.period,
        Transport: req.body.transport,
        IsApprove: req.body.isApprove,
        Paid:req.body.paid,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Holidays: req.body.holidays,
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
        <p>Approve : ${holiday.IsApprove ? 'yes' : 'no'} </p>
        <p>Paid : ${holiday.Paid} </p>

        <p>RoomCount : ${holiday.RoomCount } </p>
        <p>start date : ${holiday.startDate } </p>
        <p>end date : ${holiday.endDate } </p>`
    };

    config.transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) return console.log(error);
        console.log('Email Sent Successfully');
        console.log(info);
    })
   

    await holiday.save((err, holiday) => {
        (!err) ? res.send(holiday)
            : console.log('error in post Holiday: ' + JSON.stringify(err, undefined, 2))

    })
}


// edit holiday
exports.editBookedHoliday = async(req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No Holiday given id :  ${req.params.id}`);

    var holiday = {
        RoomCount: req.body.roomCount,
        AdultCount: req.body.adultCount,
        Child: req.body.child,
        // Period: req.body.period,
        IsApprove: req.body.isApprove,
        Paid:req.body.paid,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Holidays: req.body.holidays,
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
        <p>Approve : ${holiday.IsApprove ? 'yes' : 'no'} </p>
        <p>Paid : ${holiday.Paid} </p>

        <p>RoomCount : ${holiday.RoomCount } </p>
        <p>start date : ${holiday.startDate } </p>
        <p>end date : ${holiday.endDate } </p>`
    };

    config.transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) return console.log(error);
        console.log('Email Sent Successfully');
        console.log(info);
    })

    BookedHolidaysModel.findByIdAndUpdate(req.params.id, { $set: holiday }, { new: true },
        (err, holiday) => {
            (!err) ? res.send(holiday)
                : console.log('error in update bookedholiday: ' + JSON.stringify(err, undefined, 2))
        })
}





// delete holiday by id
exports.deleteBookedHoliday = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No holiday with given id :  ${req.params.id}`);

    BookedHolidaysModel.findByIdAndRemove(req.params.id, (err, holiday) => {
        (!err) ? res.send(holiday)
            : console.log('error in delete holiday: ' + JSON.stringify(err, undefined, 2))
    })
}



//get bookedHolidays by date
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
        const BookedModels = await BookedHolidaysModel.find({
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
        }).populate('Holidays').populate("Tourist", "-password").exec()

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




exports.getAggr = async (req, res) => {

    let query = {};
    let price = {};
    let { id } = req.query;

    // get selected BookedHolidaysModel 
    let booked = await BookedHolidaysModel.findById(id).select('Holidays').exec()
    query = booked.Holidays

    // get selected hotel id
    let holidays = await holidayModel.findById(query).exec()

    // get price value
    price = holidays.Price

    //  aggregate to sum multiply of (price * Period * RoomCount) to get total price
    await BookedHolidaysModel.aggregate(
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

// get BookedHolidays by userName
exports.getByUserName = async (req, res) => {
    let query = {};

    // Check for Tourist Ref
    if (req.query.user) {
        const TouristSearch = await UserModel.findOne(
            { "username": { $regex: new RegExp(req.query.user, "i") } }
        )
        try {

            query.Tourist = TouristSearch._id
        }
        catch {
            console.log('This user has not booked any')
        }
    }
    try {
        let bookedHolidays = await BookedHolidaysModel.find(query).populate('Holidays').exec()
        res.send(bookedHolidays)
    } catch (error) {
        res.status(404).json(error.message)
    }
}