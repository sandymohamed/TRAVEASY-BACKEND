var nodemailer = require('nodemailer');

module.exports = {
    EMAIL_USERNAME: 'ibrahimjpm8@gmail.com',
    transporter : nodemailer.createTransport({
      service: 'gmail',    
      auth: {
          type: "OAuth2",
          user: "traveasycompany@gmail.com",//process.env.EMAIL_USERNAME,
          pass: "gradProject@123" ,//process.env.MAIL_PASSWORD,
          clientId: "857182960683-q4d2kq191ktiomr3134u27v9lrt06oir.apps.googleusercontent.com",//process.env.OAUTH_CLIENTID,
          clientSecret: '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',//process.env.OAUTH_CLIENT_SECRET,
          refreshToken: '1//04E_oz5UVu4FlCgYIARAAGAQSNwF-L9IrJm1CgOhgtute1X8TK6ivTp8kVlmqzIzi-3L0IO1Yzvex5AmJmaM4ABW52DhR7uJ-HKU'//process.env.OAUTH_REFRESH_TOKEN
      }
  }) ,

  
  };