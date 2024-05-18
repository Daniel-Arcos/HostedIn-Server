const express = require('express')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()



router.get('/:accommodationId/bookings', bookingController.getBookingByAccommodationId)



module.exports = router