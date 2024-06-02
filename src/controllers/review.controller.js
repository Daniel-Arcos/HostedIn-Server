const ReviewService = require('../services/review.service')
const { validationResult } = require('express-validator')

const saveNewReview = async (req, res) => {
    try {        

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los campos falta, esta vacio o es erroneo en la peticion"
            }); 
        }

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

const getReviewByAccommodationId = async (req, res) => {
    try {
        const accommodationId = req.params.accommodationId;

        if (!accommodationId) {
            return res.status(400).send({error: "El id del alojamiento 'accommodationId' viene nulo o vacío"})
        }

        const result = await ReviewService.getAllReviews(accommodationId);

        return res.status(200).send({
            message: "Reseñas recuperadas con exito",
            reviews : result})

    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error}); 
    }
}

module.exports ={
    saveNewReview,
    getReviewByAccommodationId
}