const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function dbConnect(){
  const uri = process.env.MONGO_URI;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection error', err);
      process.exit(1);
    });
};
