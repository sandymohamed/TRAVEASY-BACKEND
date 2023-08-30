const {authJwt} = require('../middlewares');
const controller = require('../controllers/Airline.controller');

module.exports = function (app){
 app.use(function (req,res , next){
    res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept');
    next()
 });


 app.get('/airline', controller.GetAllAirline)
 app.get('/airline/:id', controller.GetAirlineByID)
 //app.get('/airlineSearch',controller.SerachAirline)
 app.put('/airline/:id',[authJwt.verifyToken],controller.updateAirline)
 app.delete('/airline/:id',[authJwt.verifyToken],controller.DeleteAirline)
 app.post('/airline',[authJwt.verifyToken],controller.CreateAirline);
 

}