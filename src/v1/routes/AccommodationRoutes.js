const express = require('express')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveBookingSchema } = require('../../validators/saveBookingShcema')
const { updateBookingSchema } = require('../../validators/updateBookingSchema')



router.post('/bookings', checkSchema(saveBookingSchema),bookingController.createBooking)
router.get('/:accommodationId/bookings', bookingController.getBookingByAccommodationId)
router.get('/bookings/:bookingId', bookingController.getBookingById)
router.put('/bookings/:bookingId', checkSchema(updateBookingSchema),bookingController.editBooking)
router.delete('/bookings/:bookingId', bookingController.deleteBookingById)


module.exports = router