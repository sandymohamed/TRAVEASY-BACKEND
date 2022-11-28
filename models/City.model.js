//City Schema
const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    City_Name:  String,
    location: { 
        //for Map Purpose
        longitude: Number,
        latitude: Number
    }

});
const cityModel =mongoose.model('City', CitySchema); 
module.exports = cityModel;