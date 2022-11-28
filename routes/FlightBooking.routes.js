const {authJwt} = require('../middlewares');
const controller = require('../controllers/FlightBooking.controller');

module.exports = function (app){
 app.use(function (req,res , next){
    res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept');
    next()
 });


 app.get('/flightBooking', controller.GetAllFlightBooking)
 app.get('/flightBooking/:id', controller.GetFlightBookingByID)
 //app.get('/flightBookingSearch',controller.SerachFlightBooking)
 app.put('/flightBooking/:id',[authJwt.verifyToken],controller.updateFlightBooking)
 app.delete('/flightBooking/:id',[authJwt.verifyToken],controller.DeleteFlightBooking)
 app.post('/flightBooking',controller.CreateFlightBooking);
 

}




