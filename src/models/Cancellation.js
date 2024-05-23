const mongoose = require('mongoose')
const model = mongoose.model

cancellationSchema = new mongoose.Schema({
    cancellationDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    cancellator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings', 
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
})

module.exports = model("cancellations", cancellationSchema)