const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
    AirlineName : String,
    Country : String,
    Evaluation  : Number,
    ImgURL:String,
    Price : Number 
  });
  
  module.exports = mongoose.model('Airline', airlineSchema);
  
