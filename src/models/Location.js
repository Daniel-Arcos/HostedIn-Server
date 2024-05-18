const mongoose = require('mongoose');
const model = mongoose.model;

locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
});

module.exports = model("locations", locationSchema)