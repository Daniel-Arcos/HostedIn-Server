const express = require('express')
const accommodationsController = require('../../controllers/accommodation.controller.js')
const bookingController = require('../../controllers/booking.controller.js')
const reviewController = require('../../controllers/review.controller.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { accommodationSchema } = require('../../validators/accommodationSchema.js')
const Authorize = require('../../middlewares/auth.middleware.js')

router.post('/', Authorize('Host'),  checkSchema(accommodationSchema), accommodationsController.createAccommodation)
router.get('/:accommodationId/bookings', Authorize('Host'), bookingController.getBookingByAccommodationId)
router.get('/', Authorize('Host,Guest'), accommodationsController.getAccommodations)
router.get('/:accommodationId/reviews', Authorize('Host,Guest'), reviewController.getReviewByAccommodationId)
router.put('/:accommodationId', Authorize('Host'), checkSchema(accommodationSchema), accommodationsController.updateAccommodation)


module.exports = router