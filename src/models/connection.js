const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;
const DB_NAME = 'Cookmaster';

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = () => MongoClient.connect(MONGO_DB_URL, OPTIONS)
  .then((conn) => conn.db(DB_NAME));

module.exports = connection;
