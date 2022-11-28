const mongoose = require('mongoose');

const bookedHotelsSchema = new mongoose.Schema({
   
    // RoomCount  : Number,    
    AdultCount : Number ,
    Child : Number,
    // Period : Number,

    Single : Number,
    Double : Number,

    IsApprove : Boolean ,
    Paid: Boolean,
    startDate: Date,
    endDate: Date,
    Hotels :  {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'Hotels',
     } ,

    Tourist :  {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      } ,
    // Guide : {type : mongoose.Schema.Types.ObjectId ,
    // ref : 'User'
    // } 
  }
  ,
  
  { timestamps: true });
  
  const BookedHotels =mongoose.model('bookedHotels', bookedHotelsSchema); 
  module.exports = BookedHotels;  

  