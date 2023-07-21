const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

var storage = new GridFsStorage({

  url: process.env.DB_URL + 'test',
  options: { useNewUrlParser: true, useUnifiedTopology: true },

  file: (req, file) => {
    console.log("file=>", file)
    const match = ['image/png', 'image/jpeg'];

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

var uploadFiles = multer({ storage: storage }).array('file', 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
