let db = require('../models');
let FlightDB = db.flight;
let airlineDB = db.airline
const ObjectId = require('mongoose').Types.ObjectId;

// get all Flight and Filtrat
const GetAllFlight = async (req, res) => {
    let query = {};
    // Check Filtration from request body
    if (req.query.FlyingFrom)
        query.FlyingFrom = req.query.FlyingFrom
    if (req.query.FlyingTo)
        query.FlyingTo = req.query.FlyingTo
    if (req.query.DepartureDate)
        query.DepartureDate = req.query.DepartureDate
    if (req.query.ReturnDate)
        query.ReturnDate = req.query.ReturnDate
    if (req.query.TravellerCount)
        query.TravellerCount = req.query.TravellerCount
    if (req.query.Child)
        query.Child = req.query.Child
    if (req.query.CabinClass)
        query.CabinClass = req.query.CabinClass
    if (req.query.Price)
        query.Price = req.query.Price
    if (req.query.IsBooking)
        query.IsBooking = req.query.IsBooking
    if (req.query.NumberTickets)
        query.NumberTickets = req.query.NumberTickets



    // create Search for eny keyword 
    if (req.query.keyword) {
        query.$or =
            [
                { "FlyingFrom": { $regex: new RegExp(req.query.keyword, "i") } }
                , { "FlyingTo": { $regex: new RegExp(req.query.keyword, "i") } }
            ]
    }
    // get page 
    const page = req.query.page ? req.query.page - 1 : 0

    // Check for Search Airline Ref
    if (req.query.Airline) {
        const AirlineSearch = await airlineDB.findOne(
            { "AirlineName": { $regex: new RegExp(req.query.Airline, "i") } }
        )

        query.Airline = AirlineSearch._id
    }

    try {
        const FlightList = await FlightDB.find(query)
            .skip(page)
            .limit(10)
            .populate('Airline', 'AirlineName')
            // .sort({DepartureDate : -1})
            .exec();

        res.send(FlightList)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

// get By id 
const GetFlightByID = async (req, res) => {
    const _id = req.params.id;
    (!ObjectId.isValid(_id)) && res.status(400).send(`No given Id  : ${_id}`);
    try {
        const Flightfind = await FlightDB.findOne({ _id }).populate("Airline").exec()

        Flightfind ? res.status(200).json(Flightfind)
            : res.status(404).send({ message: 'Not found Flight By id' })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Create Function Add Flight 
const CreateFlight = (req, res) => {

    let FlightModel = new FlightDB({
        FlyingFrom: req.body.FlyingFrom,
        FlyingTo: req.body.FlyingTo,
        Price: req.body.Price,
        DepartureDate: req.body.DepartureDate,
        ReturnDate: req.body.ReturnDate,
        TravellerCount: req.body.TravellerCount,
        Child: req.body.Child,
        Infant: req.body.Infant,
        CabinClass: req.body.CabinClass,
        IsBooking: req.body.IsBooking,
        Airline: req.body.Airline,
        NumberTickets: req.body.NumberTickets
    });

    FlightModel.save((err, model) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: 'Add Model succeed' })
    })
};


// edite Function 

const updateFlight = async (req, res) => {

    const _id = req.params.id;
    const FlyingObj = {
        FlyingFrom: req.body.FlyingFrom,
        FlyingTo: req.body.FlyingTo,
        Price: req.body.Price,
        DepartureDate: req.body.DepartureDate,
        ReturnDate: req.body.ReturnDate,
        TravellerCount: req.body.TravellerCount,
        Child: req.body.Child,
        Infant: req.body.Infant,
        CabinClass: req.body.CabinClass,
        IsBooking: req.body.IsBooking,
        Airline: req.body.Airline,
        NumberTickets: req.body.NumberTickets
    };

    try {
        const FlyingObjUpd = await FlightDB.findByIdAndUpdate(_id
            , { $set: FlyingObj }, { new: true }).exec()

        res.status(200).send(FlyingObjUpd)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// Delete Function 
const DeleteFlight = async (req, res) => {
    const _id = req.params.id
    try {
        await FlightDB.findByIdAndRemove(_id).exec();
        res.status(204).send('Delete Successed')
    } catch (err) {
        res.status(500).json(err.message);
    }
}




module.exports = { CreateFlight, GetAllFlight, GetFlightByID, DeleteFlight, updateFlight };

