/* Mongoose Connection */
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected');

    const url = 'mongodb://localhost/reddit-db';
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error: ', err);
  }
})();

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.set('debug', true);