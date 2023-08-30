var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ibrahimjpm8@gmail.com',
    pass: 'JPm0106444'
  }
});

var mailConfigurations = {
  from: 'ibrahimjpm8@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  html: `<h2>Hi! There</h2> <h5> This HTML content is 
         being send by NodeJS along with NodeMailer.</h5>'`
};



transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
       console.log('Email Sent Successfully');
    console.log(info);
})