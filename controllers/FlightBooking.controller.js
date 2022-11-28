let db = require('../models');
let FlightBookingDB = db.flightBooking;
let TouristDB = db.user;
let FlightDB = db.flight;
const ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require('nodemailer');
let config = require('../config/mailer.config')


 



// get all FlightBooking
const GetAllFlightBooking = async (req, res) => {
    try {
        // Create filteration 
        let query = {};
        if (req.query.IsBooking)
            query.IsBooking = req.query.IsBooking;

        // search in tourist Ref
        if (req.query.Tourist) {
            const TouristSea = await TouristDB.findOne(
                { _id : req.query.Tourist }
            )
            query.Tourist = TouristSea._id
        }
        // search in Flight Ref
        if (req.query.Flight) {
            const FlightSea = await TouristDB.findOne(
                { "FlyingFrom": { $regex: new RegExp(req.query.Flight, "i") } }
            )
            query.Flight = FlightSea._id
        }
        const FlightBookingList = await FlightBookingDB.find(query)
            .populate("Tourist").populate("Flight")
            .exec(); res.send(FlightBookingList)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

// get By id 
const GetFlightBookingByID = async (req, res) => {
    const _id = req.params.id;
    (!ObjectId.isValid(_id)) && res.status(400).send(`No given Id  : ${_id}`);
    try {
        const FlightBookingfind = await FlightBookingDB.findOne({ _id })
            .populate("Tourist").populate("Flight").exec()

        FlightBookingfind ? res.status(200).json(FlightBookingfind)
            : res.status(404).send({ message: 'Not found FlightBooking By id' })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Create Function Add FlightBooking 
const CreateFlightBooking = async (req, res) => {

    let FlightBookingModel = new FlightBookingDB({
        Tourist: req.body.Tourist,
        IsBooking: req.body.IsBooking,
        Flight: req.body.Flight ,
        PassportNumber : req.body.PassportNumber ,
        IsPaid : req.body.IsPaid 
        });

    const Tourist = await TouristDB.findById(req.body.Tourist).exec()
    // colling Function Healper For Cheek true is boogink 
    const Flight = await FlightDB.findByIdAndUpdate(req.body.Flight
        , { $inc: { NumberTickets: - 1 } }).exec()

    // Config Email 
    var mailConfigurations = {
        from: 'traveasycompany@gmail.com',
        to: Tourist.email,
        subject: 'booking confirmed',
        html: `<h2>Hi! ${Tourist.firstName} ${Tourist.lastName}</h2> 
        <h5> booking confirmed .</h5>
        <p >DepartureDate : ${Flight.DepartureDate} </p>
        <p >ReturnDate : ${Flight.ReturnDate}</p>     
        <p>Flying From: ${Flight.FlyingFrom}</p>
        <p>FlyingTo: ${Flight.FlyingTo}</p>
        <p>TravellerCount : ${Flight.TravellerCount}</p>
        <p>Child: ${Flight.Child}</p>
        <p>Infant: ${Flight.Infant}</p>
        <p>Cabin Class: ${Flight.CabinClass}</p>`
    };
    
    try {
        config.transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) return console.log(error);
            console.log('Email Sent Successfully');
        })
    } catch (error) {
        console.log('Email Sent error');
    }
   

    FlightBookingModel.save((err, model) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: 'Add Model succeed' })
    })
};



// edite Function 
const updateFlightBooking = async (req, res) => {

    const _id = req.params.id;
    const FlyingObj = {
        Tourist: req.body.Tourist,
        IsBooking: req.body.IsBooking,
        Flight: req.body.Flight ,
        PassportNumber : req.body.PassportNumber ,
        IsPaid : req.body.IsPaid 
    };

    try {
        const FlyingObjUpd = await FlightBookingDB.findByIdAndUpdate(_id
            , { $set: FlyingObj }, { new: true }).exec()
        res.status(200).send(FlyingObjUpd)
    } catch (error) {
        res.status(400).json(error.message);
    }
}



// Delete Function 
const DeleteFlightBooking = async (req, res) => {
    const _id = req.params.id
    try {
        await FlightBookingDB.findByIdAndRemove(_id).exec();
        res.status(204).send('Delete Successed')
    } catch (err) {
        res.status(500).json(err.message);
    }
}

module.exports = { CreateFlightBooking, GetAllFlightBooking, GetFlightBookingByID, DeleteFlightBooking, updateFlightBooking };

