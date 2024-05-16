const express = require('express')
const userController = require('../../controllers/UserController.js')
const router = express.Router()


router.get('/', (req, res) => {
    res.send("Get users")
})
router.get('/:userId', userController.getUserById)
router.put('/:userId', userController.updateUserById)
router.delete('/:userId', userController.deleteUserById)
router.post('/password', userController.sendUserEmail)
router.post('/password/code', userController.userCodeVerification)
router.patch('/password', userController.updateUserPassword)

module.exports = router