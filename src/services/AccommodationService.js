const { token } = require('morgan')
const Accommodation = require('../models/Accommodation')
const Jwt = require('../Security/Jwt')

const getAccommodationsByLocation = async (lat, long) => {
    try {
        const filteredAccomodations = await Accommodation.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(long), parseFloat(lat)]
                    },
                    $maxDistance: 8000
                }
            }
        })
        return filteredAccomodations
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
    
}

const getAllAccommodations = async () => {
    try {
        const allAccommodations = await Accommodation.find()
        return allAccommodations
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}


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
    createAccommodation,
    getAllAccommodations,
    getAccommodationsByLocation
}