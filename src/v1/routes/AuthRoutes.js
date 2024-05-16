const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/AuthControllers')
const { checkSchema } = require('express-validator')
const { signUpSchema } = require('../../validators/signUpSchema')

router.post('/signin', AuthController.signIn)
router.post('/signup', checkSchema(signUpSchema), AuthController.signUp)

module.exports = router