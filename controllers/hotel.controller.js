const hotelsModel = require('../models/Hotels.model')
const ObjectId = require('mongoose').Types.ObjectId
const CityModel = require('../models/City.model')

// get all hotels
exports.getAll = async (req, res) => {
    await hotelsModel.find({}).populate('City').exec((err, hotels) => {
        (!err) ? res.send(hotels)
            : console.log('error in get all hotels: ' + JSON.stringify(err, undefined, 2))
    })
}

// get first 3 hotels
exports.getLimit = async (req, res) => {
  const AllHotels=  await hotelsModel.find({})
  .limit(3) 
  .populate('City')
        .exec((err, hotels) => {
            (!err) ? res.send(hotels)
                : console.log('error in get all hotels: ' + JSON.stringify(err, undefined, 2))
        })
}


//get hotel by id
exports.getById = async (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No hotel given id :  ${req.params.id}`);

    await hotelsModel.findById(req.params.id).populate('City').exec((err, hotel) => {
        (!err) ? res.send(hotel)
            : console.log('error in get hotel by id : ' + JSON.stringify(err, undefined, 2))

    })
}


// post new hotel
exports.postHotel = (req, res) => {
    const hotel = new hotelsModel({
        HotelName: req.body.hotelName,
        City: req.body.city,
        Evaluation: req.body.evaluation,

        // ImgURL: req.body.img,

        // Period: req.body.period,
        // Single: req.body.single,
        // Double: req.body.double,
        Description: req.body.description,
        lon: req.body.lon,
        lat: req.body.lat,
        // startDate: req.body.startDate,
        // endDate: req.body.endDate,
        Price: req.body.price,

    })
    hotel.save((err, hotel) => {
        (!err) ? res.send(hotel)
            : console.log('error in post hotel: ' + JSON.stringify(err, undefined, 2))

    })
    console.log('in post')

}


// edit hotel
exports.editHotel = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No Holiday given id :  ${req.params.id}`);

    const hotel = {
        HotelName: req.body.hotelName,
        City: req.body.city,
        Evaluation: req.body.evaluation,
        
        // ImgURL: req.body.img,
        
        Period: req.body.period,
        // Single: req.body.single,
        // Double: req.body.double,
        Description: req.body.description,
        lon: req.body.lon,
        lat: req.body.lat,
        // startDate: req.body.startDate,
        // endDate: req.body.endDate,
        Price: req.body.price,

    }


   try{ hotelsModel.findByIdAndUpdate(req.params.id, { $set: hotel }, { new: true }).exec()
 
        res.status(200).send(hotel)
        console.log('in edit'+ hotel)

   }catch(err){
    res.status(400).json(error.message);

   }
        console.log('in hotel edit')
}





// delete hotel by id
exports.deletehotel = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No City with given id :  ${req.params.id}`);

    hotelsModel.findByIdAndRemove(req.params.id, (err, city) => {
        (!err) ? res.send(city)
            : console.log('error in delete hotel: ' + JSON.stringify(err, undefined, 2))
    })
}


// filterations:

// get Hotels by its rate
exports.getHotelsByEvaluation = async (req, res) => {

    try {
        //get rate from req.query 
        let { rate } = req.query;

        //1. check that rate is not empty
        if (rate === '') {
            return res.status(400).json({
                status: 'failure',
                message: 'Please ensure you pick two dates'
            })
        }
        //3. Query database using Mongoose
        const RateModels = await hotelsModel.find({
            //find models that it's rate is equale/more than given rate  

            $or: [
                {
                    Evaluation:
                    {
                        $eq: rate
                    }
                },
                 {
                    Evaluation: {
                        $lt: rate
                    }
                }]

        }).populate('City').exec()

        //4. Handle responses
        if (!RateModels) {
            return res.status(404).json({
                status: 'failure',
                message: 'Could not retrieve RateModels'
            })
        }
        res.status(200).json(RateModels)

    } catch (error) {
        return res.status(500).json({
            status: 'failure',
            error: error.message
        })
    }
}


// get Hotels by its price
exports.getHotelsByPrice = async (req, res) => {

    try {
        //get price from req.query 
        let { price } = req.query;

        //1. check that price is not empty
        if (price === '') {
            return res.status(400).json({
                status: 'failure',
                message: 'Please ensure you pick two dates'
            })
        }
        //3. Query database using Mongoose
        const PriceModel = await hotelsModel.find({
            //find models that it's price is equale to/less than given price  

            $or: [
                {
                    Price:
                    {
                        $eq: price
                    }
                }, {
                    Price: {
                        $lt: price
                    }
                }]

        }).populate('City').exec()

        //4. Handle responses
        if (!PriceModel) {
            return res.status(404).json({
                status: 'failure',
                message: 'Could not retrieve PriceModel'
            })
        }
        res.status(200).json(PriceModel)

    } catch (error) {
        return res.status(500).json({
            status: 'failure',
            error: error.message
        })
    }
}

// get hotel by it's name
exports.getHotelByName = async (req, res) => {

    let { hotelName } = req.query;
    //find hotel that has name similar to hotelName
    await hotelsModel.find({
        HotelName: { $regex: '.*' + hotelName + '.*' }

    }).populate('City').exec((err, hotels) => {
        (!err) ? res.send(hotels)
            : console.log('error in get hotelByName: ' + JSON.stringify(err, undefined, 2))
    })
}




// search by city 
exports.getByCity = async (req, res) => {
    let query = {};

    // Check for Search City Ref
    if (req.query.city) {
        const CitySearch = await CityModel.findOne(
            { "City_Name": { $regex: new RegExp(req.query.city, "i") } }
        )

        try {
            query.City = CitySearch._id
        }
        catch {
            console.log('No hotels in this city')
        }
    }

    try {
        let hotels = await hotelsModel.find(query).populate('City').exec()
        res.send(hotels)

    } catch (error) {
        res.status(404).json(error.message)
    }
}