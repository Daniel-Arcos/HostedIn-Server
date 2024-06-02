const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation')
const Booking = require('../models/Booking')
const BookingStatus = require('../models/BookingStatus')
const Reviews = require('../models/Review')
const Jwt = require('../security/Jwt');
const Review = require('../models/Review');
const Cancellation = require('../models/Cancellation')
const ObjectIdValidator = require('../utils/ObjectIdValidator')

const getAccommodationsByLocationAndId = async (lat, long, id) => {
    try {
        const filteredAccommodations = await Accommodation.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(long), parseFloat(lat)]
                    },
                    distanceField: "dist.calculated",
                    maxDistance: 8000,
                    spherical: true
                }
            },
            {
                $match: {
                    user: { $ne: new mongoose.Types.ObjectId(id) }
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'accommodation',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rate: {
                        $ifNull: [{ $avg: "$reviews.rating" }, 0]
                    }
                }
            },
            {
                $project: {
                    multimedias: 0,
                    "user.password": 0,
                    reviews: 0
                }
            }
        ]);

        await Accommodation.populate(filteredAccommodations, {
            path: 'user',
            select: '-password'
        });

        return filteredAccommodations;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getAllAccommodations = async (id) => {
    try {
        let matchCondition = id ? { user: { $ne: new mongoose.Types.ObjectId(id) } } : {};

        const allAccommodations = await Accommodation.aggregate([
            {
                $match: matchCondition
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'accommodation',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rate: {
                        $ifNull: [{ $avg: "$reviews.rating" }, 0]
                    }
                }
            },
            {
                $project: {
                    multimedias: 0,
                    "user.password": 0,
                    reviews: 0 // Optionally exclude the reviews array
                }
            }
        ]);

        await Accommodation.populate(allAccommodations, {
            path: 'user',
            select: '-password'
        });

        return allAccommodations;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}
const getAllOwnedAccommodations = async (id) => {
    try {
        if (!id) {
            throw {
                status: 400,
                message: "User ID is required"
            };
        }

        if (!ObjectIdValidator.isValidObjectId(id)) {
            throw {
                status: 400,
                message: "User ID is not valid"
            };
        }

        const userAccommodation = await Accommodation.find({ 'user._id': id });
        if (!userAccommodation) {
            throw {
                status: 404,
                message: "Accommodations not found for userId"
            };
        }

        const allAccommodations = await Accommodation.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'accommodation',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rate: {
                        $ifNull: [{ $avg: "$reviews.rating" }, 0]
                    }
                }
            },
            {
                $project: {
                    multimedias: 0,
                    "user.password": 0,
                    reviews: 0 
                }
            }
        ]);

        await Accommodation.populate(allAccommodations, {
            path: 'user',
            select: '-password'
        });

        console.log(allAccommodations)

        return allAccommodations;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}
const getOwnedBookedAccommodations = async (id) => {
    try {

        if (!id) {
            throw {
                status: 400,
                message: "User ID is required"
            };
        }

        if (!ObjectIdValidator.isValidObjectId(id)) {
            throw {
                status: 400,
                message: "User ID is not valid"
            };
        }

        const userAccommodation = await Accommodation.find({ 'user._id': id });
        if (!userAccommodation) {
            throw {
                status: 404,
                message: "Accommodations not found for userId"
            };
        }

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
                    multimedias: 0,
                    user: 0                    
                }
            }
        ])    
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

        const hasBookings = await Booking.findOne({accommodation : accommodation._id, bookingStatus : BookingStatus.CURRENT})
        if (hasBookings) {
            throw {
                status: 400,
                message: "El alojamiento todavia tiene reservaciones pendientes."
            }
        }

        const savedAccommodation = await Accommodation.findOneAndUpdate({_id : accommodation._id}, {$set : accommodation}, {new: true});

        foundAccommodation = await Accommodation.findById(savedAccommodation._id, '-multimedias').populate({
            path: 'user',
            select: '-password',
            select: '-profilePhoto'
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
    getAllOwnedAccommodations,
    deleteAccommodation
}