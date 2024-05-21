const { token } = require('morgan')
const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation')
const Booking = require('../models/Booking')
const Jwt = require('../Security/Jwt')

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

const getOwnedAccommodations = async (id) => {
    try {
        let accommodationsFound
        const objectId = new mongoose.Types.ObjectId(id);
        accommodationsFound = await Booking.aggregate([
            {
                $match: {
                    hostUser: objectId
                }
            },
            {
                $group: {
                    _id : "$accommodationId"
                }
            },
            {
                $lookup:{
                    from: "accomodations",
                    localField: "_id",
                    foreignField:"_id",
                    as:"accommodationsDetails"
                }
            },
            {
                $unwind:"$accommodationsDetails"
            },
            {
                $replaceRoot:{newRoot: "$accommodationsDetails"}
            }
        ])    
        return accommodationsFound
    } catch (error) {
        console.log(error)
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getBookedAccommodations = async (id, status) => {
    try {
        let accommodationsFound
        accommodationsFound = await Booking.find({guestUser:id, bookingStatus:status}).populate({
            path: 'accommodationId',
            populate:{
                path: 'user',
                select: '-password'
            }
        })  
        return accommodationsFound
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
    getAccommodationsByLocationAndId,
    getOwnedAccommodations, 
    getBookedAccommodations
}