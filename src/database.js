const mongoose = require('mongoose');
const dotenv = require('dotenv')
const user = process.env.USER_BD;
const password = encodeURIComponent(process.env.PASSWORD_BD);
const dbName = process.env.NAME_BD; 
const ipDirection = process.env.IP_BD;
const dbPort = process.env.PORT_BD;

mongoose.connect(`mongodb://${user}:${password}@${ipDirection}:${dbPort}/${dbName}`)
    .then(db => console.log('Db is connected'))
    .catch(error => console.error('Error connecting to database:', error));
