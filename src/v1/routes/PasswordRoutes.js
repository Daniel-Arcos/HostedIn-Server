const express = require('express')
const router = express.Router()
const PasswordController = require('../../controllers/PasswordControllers')

router.post('/sendemailcode', PasswordController.sendEmailCode)
router.post('/verifycode', PasswordController.verifyEmailCode)
router.post('/changepasswithcode', PasswordController.changePasswordByCode)

module.exports = router