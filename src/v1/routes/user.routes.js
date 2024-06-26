const express = require('express')
const userController = require('../../controllers/user.controller.js')
const bookingController = require('../../controllers/booking.controller.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { changePasswordSchema } = require('../../validators/changePasswordShcema.js')
const { updateUserSchema } = require('../../validators/updateUserSchema.js')
const Authorize = require('../../middlewares/auth.middleware.js')

router.get('/:userId', Authorize('Guest,Host'), userController.getUserById)
router.put('/:userId', Authorize('Guest,Host'), checkSchema(updateUserSchema), userController.updateUserById)
router.delete('/:userId', Authorize('Guest,Host'), userController.deleteUserById)
router.get('/:userId/accommodations', Authorize('Host'), userController.getHostAccommodationsByUserId)
router.get('/:userId/bookings',Authorize('Guest'), bookingController.getGuestBookings)
router.post('/passwords', userController.sendUserEmail)
router.post('/passwords/code', userController.userCodeVerification)
router.patch('', checkSchema(changePasswordSchema), userController.updateUserPassword)

module.exports = router