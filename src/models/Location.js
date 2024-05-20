const mongoose = require('mongoose');
const model = mongoose.model;

locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    address: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
});

module.exports = model("locations", locationSchema)