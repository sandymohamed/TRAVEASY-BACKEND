const {authJwt} = require('../middlewares');
const controller = require('../controllers/Flight.controller');

module.exports = function (app){
 app.use(function (req,res , next){
    res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept');
    next()
 });


 app.get('/flight', controller.GetAllFlight)
 app.get('/flight/:id', controller.GetFlightByID)
 //app.get('/flightSearch',controller.SerachFlight)
 app.put('/flight/:id',[authJwt.verifyToken],controller.updateFlight)
 app.delete('/flight/:id',[authJwt.verifyToken],controller.DeleteFlight)
 app.post('/flight',[authJwt.verifyToken],controller.CreateFlight);
 

}