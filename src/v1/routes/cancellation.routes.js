const express = require('express')
const router = express.Router()
const { checkSchema } = require('express-validator')
const {saveCancellationSchema } = require('../../validators/saveCancellationSchema.js')
const Authorize = require('../../middlewares/auth.middleware.js')
const cancellationController = require('../../controllers/cancellation.controller.js')


router.post('/', Authorize('Guest,Host'), checkSchema(saveCancellationSchema), cancellationController.createCancellation)

module.exports = router