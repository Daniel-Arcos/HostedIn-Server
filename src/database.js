const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const user = process.env.USER_BD;
const password = encodeURIComponent(process.env.PASSWORD_BD);
const dbName = process.env.NAME_BD; 

mongoose.connect(`mongodb://${user}:${password}@192.168.100.26:27017/${dbName}`)
    .then(db => console.log('Db is connected'))
    .catch(error => console.error('Error connecting to database:', error));
