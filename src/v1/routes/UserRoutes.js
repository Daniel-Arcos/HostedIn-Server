const express = require('express')
const userController = require('../../controllers/UserController.js')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { changePasswordSchema } = require('../../validators/changePasswordShcema.js')


router.get('/', (req, res) => {
    res.send("Get users")
})
router.get('/:userId', userController.getUserById)
router.put('/:userId', userController.updateUserById)
router.delete('/:userId', userController.deleteUserById)
router.post('/passwords', userController.sendUserEmail)
router.post('/passwords/code', userController.userCodeVerification)
router.patch('/passwords', checkSchema(changePasswordSchema), userController.updateUserPassword)
router.get('/:userId/accommodations', userController.getAccommodationsByUserId)

module.exports = router