const express = require('express')
const bookingController = require('../../controllers/booking.controller.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveBookingSchema } = require('../../validators/saveBookingSchema.js')
const Authorize = require('../../middlewares/auth.middleware.js')


router.post('/', Authorize('Guest'), checkSchema(saveBookingSchema),bookingController.createBooking)
router.get('/:bookingId', Authorize('Guest,Host'), bookingController.getBookingById)

module.exports = router
