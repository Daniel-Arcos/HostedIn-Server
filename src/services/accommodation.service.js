const { token } = require('morgan')
const Accommodation = require('../models/Accommodation')
const Jwt = require('../security/Jwt')

const getAccommodationsByLocationAndId = async (lat, long, id) => {
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
            },
            user: { $ne: id }
        }).populate('user')
        return filteredAccomodations
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
    
}

const getAllAccommodations = async (id) => {
    try {

        let allAccommodations
        if (id) {
            allAccommodations = await Accommodation.find({
                user: { $ne: id }
            }).populate({
                path: 'user',
                select: '-password' 
            })
        } else {
            allAccommodations =  await Accommodation.find().populate({
                path: 'user',
                select: '-password' 
            })
        }
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

        return savedAccommodation

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
    getAccommodationsByLocationAndId
}