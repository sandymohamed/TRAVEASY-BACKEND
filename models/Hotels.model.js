const mongoose = require('mongoose');

const hotelsSchema = new mongoose.Schema({
    HotelName : String,
    City :  {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'City',
     } ,
    Evaluation  : Number,
    
    // ImgURL:[String],


    // Period : Number,
    // Single : Number,
    // Double : Number,
    // startDate: Date,
    // endDate: Date,
    Description: String,
    lon:String,
    lat:String,
    Price : Number ,

  }
  );
    
  const hotelsModel =mongoose.model('Hotels', hotelsSchema); 
  module.exports = hotelsModel;