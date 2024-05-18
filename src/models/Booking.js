const mongoose = require('mongoose')
const model = mongoose.model

bookingShcema = new mongoose.Schema({
    accommodationId:{
        type: String, 
        required: true
    },
    beginningDate: {
        type: Date, 
        required: true
    },
    endingDate: {
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number, 
        required: true
    },
    totalCost: {
        type: Number, 
        required: true
    },
    bookingStatus: {
        type: String, 
        required: true
    },
    guestUserId:{
        type: String, 
        unique: true,
        required: true
    },
    guestName: {
        type: String,
        required : true
    },
    hostName: {
        type: String,
        required : true
    }
},
{
    timeseries: true,
    versionKey: false
})

module.exports = model("bookings", bookingShcema)