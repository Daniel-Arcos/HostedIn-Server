const express = require('express')
const router = express.Router()
const userRoutes = require('./UserRoutes')
const authRoutes = require('./AuthRoutes')
const accomodationRoutes = require('./AccommodationRoutes')
const bookingRoutes = require('./BookingRoutes')

router.route("/").get((req, res) => {
    res.send(`<H1>Hello desde ${req.baseUrl}</H1>`)
})

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/accommodations", accomodationRoutes)
router.use("/bookings", bookingRoutes)

module.exports = router