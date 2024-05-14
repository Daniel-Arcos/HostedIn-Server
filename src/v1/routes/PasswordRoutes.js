const express = require('express')
const router = express.Router()
const PasswordController = require('../../controllers/PasswordControllers')

router.post('/sendEmailCode', PasswordController.sendEmailCode)

module.exports = router