var mongoose = require('mongoose');

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_SERVER = process.env.DB_SERVER;

mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_SERVER}`, { useMongoClient: true }, function (err) {
  if (err) throw err;
  console.log('DB: Successfully connected');
});