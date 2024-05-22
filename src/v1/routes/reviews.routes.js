const express = require('express')
const router = express.Router()
const { checkSchema } = require('express-validator')
const { saveReviewSchema } = require('../../validators/saveReviewSchema.js')
const reviewController = require('../../controllers/review.controller.js')
const Authorize = require('../../middlewares/auth.middleware.js')


router.post('/', Authorize('Guest'), checkSchema(saveReviewSchema), reviewController.saveNewReview)


module.exports = router