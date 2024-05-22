const ReviewService = require('../services/review.service')

const saveNewReview = async (req, res) => {
    try {        
        const {accommodation, reviewDescription, rating, guestUser} = req.body
        const newReview = {
            accommodation,
            reviewDescription,
            rating,
            guestUser
        }
        const savedReview = await ReviewService.saveNewReview(newReview)
        res.status(201).send({
            message: "Review created succesfully",
            review: savedReview
        })
    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports ={
    saveNewReview
}