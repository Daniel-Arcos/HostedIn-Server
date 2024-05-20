const mongoose = require('mongoose')
const model = mongoose.model

bookingShcema = new mongoose.Schema({
    accommodationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accomodations', 
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
    guestUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    hostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
},
{
    timeseries: true,
    versionKey: false
})

module.exports = model("bookings", bookingShcema)