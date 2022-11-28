const upload = require('../middlewares/upload');
const dbConfig = require('../config/db.config');

const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;

const url = dbConfig.url;
const baseUrl = 'http://localhost:8080/files/';

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {

  try {
    await upload(req, res);

    if (req.file <= 0) {

      return res.send({
        message: 'You must select at least 1 file.',
      });
    }

    return res.send({
      message: 'Files has been uploaded.',
    });
  } catch (error) {

    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.DB);
    const images = database.collection(dbConfig.imgBucket + '.files');

    const cursor = images.find({});

    if ((await cursor.collation().count_documents) === 0) {
      return res.status(500).send({
        message: 'No files found!',
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.DB);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on('data', function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on('error', function (err) {
      return res.status(404).send({ message: 'Cannot download the Image!' });
    });

    downloadStream.on('end', () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const getImg = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.DB);
    const images = database.collection(dbConfig.imgBucket + '.files');

    const cursor = images.find({});
    // let { imgName } = req.query;

    if ((await cursor.collation().count_documents) === 0) {
      return res.status(500).send({
        message: 'No files found!',
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });
    const regex = new RegExp('.*' + req.query.imgName  + '.*', 'gi');

   const img= fileInfos.filter((img)=> (
      // img.name ===  req.query.imgName 
      img.name.match(regex)
    ))

    return res.status(200).send(img);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
  getImg
};
