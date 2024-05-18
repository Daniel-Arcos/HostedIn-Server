const express = require('express')
const bookingController = require('../../controllers/BookingsController.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveBookingSchema } = require('../../validators/saveBookingShcema')
const { updateBookingSchema } = require('../../validators/updateBookingSchema')


router.post('', checkSchema(saveBookingSchema),bookingController.createBooking)
router.get('/:bookingId', bookingController.getBookingById)
router.put('/:bookingId', checkSchema(updateBookingSchema),bookingController.editBooking)
router.delete('/:bookingId', bookingController.deleteBookingById)

module.exports = router