const express = require('express')
const roleController = require('../../controllers/role.controller.js')
const router = express.Router()

router.get('/', roleController.getAll)
module.exports = router