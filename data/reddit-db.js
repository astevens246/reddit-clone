const mongoose = require('mongoose');

// Define the connection string for your MongoDB database
const url = 'mongodb://localhost/reddit-db';

mongoose.connect(url)
  .then(() => console.log('Connected successfully to database'))
  .catch(err => console.error('Database connection error: ', err));

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));