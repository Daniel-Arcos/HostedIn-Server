const express = require('express')
const router = express.Router()
const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes')
const accomodationRoutes = require('./accommodations.routes')
const bookingRoutes = require('./booking.routes')
const roleRoutes = require('./role.routes')

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/accommodations", accomodationRoutes)
router.use("/bookings", bookingRoutes)
router.use("/roles", roleRoutes)

module.exports = router