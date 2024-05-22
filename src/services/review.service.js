const Review = require('../models/Review');

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

module.exports = {
    saveNewReview
}