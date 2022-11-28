const ObjectId = require('mongoose').Types.ObjectId
const CityModel = require('../models/City.model')


exports.getAll = async (req, res) => {
    await CityModel.find({}).exec((err, city) => {
        (!err) ? res.send(city)
            : console.log('error in get city by id : ' + JSON.stringify(err, undefined, 2))

    })
}


exports.postCity = async(req, res)=> {
    const city = new CityModel({
        City_Name:  req.body.City_Name,
        location: { 
            //for Map Purpose
            longitude: req.body.lon,
            latitude: req.body.lat
        }

    })
    await city.save((err, city)=> {
        (!err) ? res.send(city) 
        : console.log('error in post City: ' + JSON.stringify(err, undefined, 2))

    }) 
}
// delete city by id
exports.deleteCity = (req, res) => {
    (!ObjectId.isValid(req.params.id)) && res.status(400).send(`No City with given id :  ${req.params.id}`);

    CityModel.findByIdAndRemove(req.params.id, (err, city) => {
        (!err) ? res.send(city)
            : console.log('error in delete city: ' + JSON.stringify(err, undefined, 2))
    })
}