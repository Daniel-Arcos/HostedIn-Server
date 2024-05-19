const express = require('express')
const accommodationsController = require('../../controllers/AccommodationsController.js')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { accommodationSchema } = require('../../validators/accommodationSchema.js')

router.post('/', checkSchema(accommodationSchema), accommodationsController.createAccommodation)
router.get('/:accommodationId/bookings', bookingController.getBookingByAccommodationId)
router.get('/', accommodationsController.getAccommodations)


module.exports = router