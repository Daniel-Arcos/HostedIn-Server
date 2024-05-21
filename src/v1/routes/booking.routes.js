const express = require('express')
const bookingController = require('../../controllers/booking.controller.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveBookingSchema } = require('../../validators/saveBookingSchema.js')
const { updateBookingSchema } = require('../../validators/updateBookingSchema.js')
const Authorize = require('../../middlewares/auth.middleware.js')


router.post('/', Authorize('Guest'), checkSchema(saveBookingSchema),bookingController.createBooking)
router.get('/:bookingId', Authorize('Guest,Host'), bookingController.getBookingById)
router.put('/:bookingId', Authorize('Guest,Host'), checkSchema(updateBookingSchema),bookingController.editBooking)
router.delete('/:bookingId', Authorize('Guest,Host'), bookingController.deleteBookingById)

module.exports = router
