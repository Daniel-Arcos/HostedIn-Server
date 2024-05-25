const { token } = require('morgan')
const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation')
const Booking = require('../models/Booking')
const BookingStatus = require('../models/BookingStatus')
const Reviews = require('../models/Review')
const Jwt = require('../security/Jwt');
const Review = require('../models/Review');
const Cancellation = require('../models/Cancellation') 

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
        }, '-multimedias').populate({
            path: 'user',
            select: '-password'
        })
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
            allAccommodations = await Accommodation.find(
                { user: { $ne: id }},
                '-multimedias'
            ).populate({
                path: 'user',
                select: '-password' 
            })
        } else {
            allAccommodations =  await Accommodation.find({}, '-multimedias').populate({
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

const getAllOwnedAccommodations = async (id) => {
    try {

        let allAccommodations
        if (id) {
            allAccommodations = await Accommodation.find({
                user: id
            })
            .select('-multimedias')
            .populate({
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

const getOwnedBookedAccommodations = async (id) => {
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
                    _id : "$accommodation"
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
            },
            {
                $project: {
                    multimedia: 0
                }
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

const getGuestBookedAccommodations = async (id, status) => {
    try {
        let accommodationsFound
        accommodationsFound = await Booking.find({guestUser:id, bookingStatus:status})
        .populate({
            path: 'accommodation',
            select: '-multimedias',
            populate:{
                path: 'user',
                select: '-password'
            }
        })  
        return accommodationsFound
    } catch (error) {
        console.log(error)
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

        foundAccommodation = await Accommodation.findById(savedAccommodation._id).populate({
            path: 'user',
            select: '-password'
        })

        return foundAccommodation

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const updateAccommodation = async (accommodation) => {
    try {
        let accommodationFound = await Accommodation.findById(accommodation._id )
        if (!accommodationFound) {
            throw {
                status: 404,
                message: "El alojamiento no existe."
            }
        }

        const savedAccommodation = await Accommodation.findOneAndUpdate({_id : accommodation._id}, {$set : accommodation}, {new: true});

        foundAccommodation = await Accommodation.findById(savedAccommodation._id).populate({
            path: 'user',
            select: '-password'
        })

        return foundAccommodation

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const deleteAccommodation = async (accommodationId) =>{
    try {
        let accommodationFound = await Accommodation.findById(accommodationId )
        if (!accommodationFound) {
            throw {
                status: 404,
                message: "El alojamiento no existe."
            }
        }
        const hasBookings = await Booking.findOne({accommodation : accommodationId, bookingStatus : BookingStatus.CURRENT})
        if (hasBookings) {
            throw {
                status: 400,
                message: "El alojamiento todavia tiene reservaciones pendientes."
            }
        }
        
        const bookings = await Booking.find({ accommodation: accommodationId });
        const bookingsId = bookings.map(book => book._id);
        await Accommodation.deleteOne({ _id: accommodationId });
        await Review.deleteMany({ accommodation: accommodationId });
        await Cancellation.deleteMany({ booking: { $in: bookingsId } });
        await Booking.deleteMany({ accommodation: accommodationId });

        return "Alojamiento y recursos relacionado borrados exitosamente"
    } catch (error) {
        console.log(error)
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = { 
    createAccommodation,
    updateAccommodation,
    getAllAccommodations,
    getAccommodationsByLocationAndId,
    getOwnedBookedAccommodations, 
    getGuestBookedAccommodations,
    getAllOwnedAccommodations,
    deleteAccommodation
}