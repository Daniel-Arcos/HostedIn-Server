const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/auth.controller')
const { checkSchema } = require('express-validator')
const { signUpSchema } = require('../../validators/signUpSchema')
const { signInSchema } = require('../../validators/signInSchema')

router.post('/signin', checkSchema(signInSchema), AuthController.signIn)
router.post('/signup', checkSchema(signUpSchema), AuthController.signUp)
router.get('/time', AuthController.time)
module.exports = router