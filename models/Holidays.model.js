const mongoose = require('mongoose');

const holidaysSchema = new mongoose.Schema({
    // Country : String,
    City :  {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'City',
     } ,
    Description: String,
    Evaluation  : Number,

    // ImgURL:[String],

    Period : String ,
    Price : Number ,
    // Tourist :  {
    //    type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   } ,
    // Guide : {type : mongoose.Schema.Types.ObjectId ,
    // ref : 'User'} 
  });
  
  

  const holidaysModel =mongoose.model('Holidays', holidaysSchema); 
  module.exports = holidaysModel;
  
