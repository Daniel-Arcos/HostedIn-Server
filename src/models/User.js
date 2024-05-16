const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const model = mongoose.model

userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        default: ""
    },
    residence: {
        type: String,
        default: ""
    },
    profilePhoto: {
        type: Buffer,
        default: {
            "type": "Buffer",
            data: []
        }
    }
},
{
    timestamps: true,
    versionKey: false,
})

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

module.exports = model("users", userSchema)