const mongoose = require('mongoose');
const model = mongoose.model;
const userSchema = require('./User');
const locationSchema = require('./Location').schema;

accommodationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: String
    },
    accommodationType: {
        type: String, 
        required: true
    },
    nightPrice: {
        type: Number,
        required: true
    },
    guestsNumber: {
        type: Number,
        required: true
    },
    roomsNumber: {
        type: Number,
        required: true
    },
    bedsNumber: {
        type: Number,
        required: true
    },
    bathroomsNumber: {
        type: Number,
        required: true
    },
    accommodationServices: {
        type: Array,
        default: [String]
    },
    location: {
        type: locationSchema,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    multimedias: [{
        type: Buffer,
        default: Buffer.alloc(0)
    }]
},
{
    timestamps: true,
    versionKey: false,
});

accommodationSchema.index({ "location": "2dsphere"});

module.exports = model("accomodations", accommodationSchema)