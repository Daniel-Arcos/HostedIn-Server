const express = require('express')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()


router.post('/booking', bookingController.createBooking)
router.get('/bookings/:accommodationId', bookingController.getBookingByAccommodationId)
router.get('/bookings/:bookingId', bookingController.getBookingById)
router.put('/booking/:bookingId',bookingController.editBooking)
router.delete('/booking/:bookingId', bookingController.deleteBookingById)


module.exports = router