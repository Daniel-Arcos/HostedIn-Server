const express = require('express')
const accommodationsController = require('../../controllers/AccommodationsController.js')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveBookingSchema } = require('../../validators/saveBookingShcema')
const { updateBookingSchema } = require('../../validators/updateBookingSchema')
const { accommodationSchema } = require('../../validators/accommodationSchema.js')



router.post('/', checkSchema(accommodationSchema), accommodationsController.createAccommodation)
//TODO: router.get('/', accommodationsController.getAllAccommodations)
//TODO: router.get('/:accommodationId', accommodationsController.getAccommodationById)


router.post('/bookings', checkSchema(saveBookingSchema),bookingController.createBooking)
router.get('/:accommodationId/bookings', bookingController.getBookingByAccommodationId)
router.get('/bookings/:bookingId', bookingController.getBookingById)
router.put('/bookings/:bookingId', checkSchema(updateBookingSchema),bookingController.editBooking)
router.delete('/bookings/:bookingId', bookingController.deleteBookingById)


module.exports = router