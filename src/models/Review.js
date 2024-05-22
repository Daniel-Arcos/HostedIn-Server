const mongoose = require('mongoose')
const model = mongoose.model

reviewShcema = new mongoose.Schema({
    accommodation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accomodations', 
        required: true
    },
    reviewDescription: {
        type: String, 
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    guestUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
},
{
    timeseries: true,
    versionKey: false
})

module.exports =   model("reviews",reviewShcema)