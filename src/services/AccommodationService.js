const { token } = require('morgan')
const Accommodation = require('../models/Accommodation')
const Jwt = require('../Security/Jwt')

//TODO: Token
const createAccommodation = async (accommodation) => {
    try {

        const accommodationFound = await Accommodation.findOne({ title: accommodation.title })

        if (accommodationFound) {
            throw {
                status: 400,
                message: "El alojamiento ya se encuentra registrado."
            }
        }

        const newAccommodation = new Accommodation(accommodation);
        const savedAccommodation = await newAccommodation.save();

        return [savedAccommodation]

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = { 
    createAccommodation
}