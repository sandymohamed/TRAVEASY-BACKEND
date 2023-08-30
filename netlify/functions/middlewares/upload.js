// const util = require('util');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');

// var storage = new GridFsStorage({

//   url: 'mongodb+srv://sandysawy:GJMs0Brs133ZJMkM@cluster0.nyw9gms.mongodb.net/traveasy/' + 'test',
//   // process.env.DB_URL || 
//   options: { useNewUrlParser: true, useUnifiedTopology: true },

//   file: (req, file) => {
//     console.log("reeq => ", req)
//     console.log("file => ", file)
//     const match = ['image/png', 'image/jpeg'];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-traveasy-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: 'photos',
//       filename: `${Date.now()}-traveasy-${file.originalname}`,
//     };
//   },
// });

// var uploadFiles = multer({ storage: storage }).array('file', 10);
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;

const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose'); // Import mongoose

// Define your MongoDB Atlas connection URL
const mongoURI = 'mongodb+srv://sandysawy:dg5HkZRdjdfvjwOL@cluster0.nyw9gms.mongodb.net/traveasy' + 'test';

// Create a mongoose connection instance
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize GridFsStorage with the mongoose connection
const storage = new GridFsStorage({
  db: conn, // Use the mongoose connection
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg', 'image/jfif'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-traveasy-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-traveasy-${file.originalname}`,
    };
  },
});

// Create multer instance using the storage
const uploadFiles = multer({ storage: storage }).array('file', 10);
const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
