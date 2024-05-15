const mongoose = require('mongoose')
const model = mongoose.model

passwordCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    inssuanceDate: {
        type: Date,
        required: true
    }
},
{
    timesStamps: true,
    versionKey: false,
})

module.exports = model("passwordCodes", passwordCodeSchema)