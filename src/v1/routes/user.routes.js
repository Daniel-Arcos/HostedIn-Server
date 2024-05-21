const express = require('express')
const userController = require('../../controllers/user.controller.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { changePasswordSchema } = require('../../validators/changePasswordShcema.js')
const Authorize = require('../../middlewares/auth.middleware.js')

router.get('/:userId', Authorize('Guest,Host'), userController.getUserById)
router.put('/:userId', Authorize('Guest,Host'), userController.updateUserById)
router.delete('/:userId', Authorize('Guest,Host'), userController.deleteUserById)
router.post('/passwords', userController.sendUserEmail)
router.post('/passwords/code', userController.userCodeVerification)
router.patch('/passwords', checkSchema(changePasswordSchema), userController.updateUserPassword)
router.get('/:userId/accommodations', userController.getAccommodationsByUserId)

module.exports = router