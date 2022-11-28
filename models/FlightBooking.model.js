const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({
        
    IsBooking : Boolean ,
    BookingDate :  {
      type: Date,
      default: Date.now
    } ,
     PassportNumber :{
       type: String
     },
     IsPaid :  {
      type: Boolean,
      default: false
    } ,
    Tourist :  {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      } ,
      Flight : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    }   
       
  });
  
  module.exports = mongoose.model('FlightBooking', flightBookingSchema);
  
