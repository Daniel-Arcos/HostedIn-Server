const express = require('express')
const userController = require('../../controllers/UserController.js')
const router = express.Router()


router.get('/', (req, res) => {
    res.send("Get users")
})
router.get('/:userId', userController.getUserById)
router.put('/:userId', userController.updateUserById)
router.delete('/:userId', userController.deleteUserById)

module.exports = router