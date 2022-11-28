
let db = require('../models');
let AirlineDB = db.airline;
const ObjectId = require('mongoose').Types.ObjectId ;




// get all Airline 
const GetAllAirline = async (req, res) => {

    let query = {}

    // create Search for eny keyword 
    if (req.query.keyword) {
        query.$or =
            [
                { "AirlineName": { $regex: new RegExp(req.query.keyword, "i") } }
                , { "Country": { $regex: new RegExp(req.query.keyword, "i") } }
            ]
    }

    try {
        await AirlineDB.find(query).exec((err,airlinelist)=>{
            (!err)? res.send(airlinelist) 
             :  res.status(404).send({ message: 'Airline is Not found.' });     
             })
        
    } catch (error) {
        res.status(500).json(error.message)
    }   
}

// get By id 
const GetAirlineByID = async (req, res)=> {    
    const _id = req.params.id ; 
   (!ObjectId.isValid(_id)) && res.status(400).send(`No given Id  : ${_id}`);
   try {
    const Airlinefind = await AirlineDB.findOne({_id}).exec()
    
    Airlinefind ? res.status(200).json(Airlinefind) 
    : res.status(404).send({message:'Not found Airline By id'})
   } catch (error) {
    res.status(500).json(error.message)
   }   
}
// Create Function Add Airline 
const CreateAirline = (req, res)=> {
    let {AirlineName , Country ,Evaluation ,ImgURL
         , Price} = req.body;
    let airlineModel = new AirlineDB({
    AirlineName : AirlineName,
    Country : Country,
    Evaluation  : Evaluation,
    ImgURL:ImgURL,
    Price : Price         
    });

    airlineModel.save((err,model)=>{
        if(err){
            res.status(500).send({message:err});
            return ;
        }
      res.send({message :'Add Model succeed'})
    })
};


// edite Function 
const updateAirline = async(req,res) =>{
    
    const _id = req.params.id;
    const airlineObj = {
    AirlineName : req.body.AirlineName,
    Country : req.body.Country,
    Evaluation  : req.body.Evaluation,
    ImgURL:req.body.ImgURL,
    Price : req.body.Price   
    } ;

    try {
    const airlineUpd =  await AirlineDB.findByIdAndUpdate(_id
        ,{$set: airlineObj},{new:true}).exec()

      res.status(200).send(airlineUpd)        
    } catch (error) {
        res.status(400).json(error.message);        
    }    
}

// Delete Function 
const DeleteAirline = async (req,res) =>{
    const _id = req.params.id 

    try{
      await AirlineDB.findByIdAndRemove(_id).exec();
      res.status(204).send('Delete Successed')
    } catch (err) {
       res.status(500).json(err.message);
    }
}

module.exports = { CreateAirline , GetAllAirline , GetAirlineByID ,DeleteAirline , updateAirline };

