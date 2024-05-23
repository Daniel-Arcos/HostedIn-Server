const Review = require('../models/Review');

const ID_MONGO_DB_SIZE = 24;

const saveNewReview= async (review) => {
    try {
        const foundReview = await Review.findOne({accommodation: review.accommodation, guestUser: review.guestUser}) 
        if(foundReview){            
            throw {
                status: 400,
                message: "Ya tienes una review de este alojamiento"
            }
        }        
        const newReview = new Review({
            accommodation: review.accommodation,
            reviewDescription: review.reviewDescription,
            rating: review.rating,
            guestUser: review.guestUser

        })
        const savedReview = await newReview.save()
        return savedReview
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getAllReviews = async (accommodationId) => {
    try {
        if (typeof accommodationId !== 'string' || accommodationId.trim() === '' || accommodationId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }
    
        const reviews = Review.find({accommodation: accommodationId})
        .populate({
            path: 'guestUser',
            select: '-password' 
        });
    
        if (!reviews) {
            throw {
                status: 404,
                message: "Reseñas no encontradas para el alojamiento"
            }
        }
        
        return reviews;

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = {
    saveNewReview,
    getAllReviews
}