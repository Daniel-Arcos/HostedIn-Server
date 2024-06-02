const mongoose = require('mongoose')
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL)
    .then(db => console.log('Db is connected'))
    .catch(error => console.log(error))