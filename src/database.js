const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/hostedindb")
    .then(db => console.log('Db is connected'))
    .catch(error => console.log(error))