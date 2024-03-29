const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
const db = require('./models');
const connectDB = require('./config/db.config');
const Role = db.role;
const { cityRouter } = require('./netlify/functions/routes/city.routes');
const { holidaysRouter } = require('./netlify/functions/routes/holidays.routes')
const { hotelsRouter } = require('./netlify/functions/routes/hotels.routes')
const { bookedHolidaysRouter } = require('./netlify/functions/routes/bookedHoliddays.routes')
const { bookedHotelsRouter } = require('./netlify/functions/routes/bookedHotels.routes');
const { FeedbackRouter } = require('./netlify/functions/routes/feedback.routes');
const {stripeRoutes} = require('./netlify/functions/routes/stripe.routes');


connectDB();


// front end credentials
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:8081'],
  })
);

// parse requests of content-type - application/json
app.use(express.json({ limit: '10mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  cookieSession({
    name: 'traveasy-session',
    secret: 'COOKIE_SECRET', // should use as secret environment variable
    httpOnly: true,
  })
);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


app.use(["/city", "/citys"], cityRouter);
app.use(["/holiday", "/holidays"], holidaysRouter);
app.use(["/hotel", "/hotels"], hotelsRouter);
app.use(["/bookedHoliday", "/bookedHolidays"], bookedHolidaysRouter);
app.use(["/bookedHotel", "/bookedHotels"], bookedHotelsRouter);
app.use(["/feedback", "/feedbacks"], FeedbackRouter);
app.use(["/stripe", "/stripes"], stripeRoutes);


require('./netlify/functions/routes/upload.routes')(app);
require('./netlify/functions/routes/auth.routes')(app);
require('./netlify/functions/routes/user.routes')(app);
require('./netlify/functions/routes/airline.routes')(app);
require('./netlify/functions/routes/Flight.routes')(app);
require('./netlify/functions/routes/FlightBooking.routes')(app);

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({ name: 'user' }).save((err) => {
        if (err) {
          console.log('Error!', err);
        }
        console.log('added user role success!');
      });
      new Role({ name: 'moderator' }).save((err) => {
        if (err) {
          console.log('Error!', err);
        }
        console.log('added moderator role success!');
      });
      new Role({ name: 'admin' }).save((err) => {
        if (err) {
          console.log('Error!', err);
        }
        console.log('added admin role success!');
      });
    }
  });

}


