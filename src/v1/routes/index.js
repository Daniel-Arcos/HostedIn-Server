const express = require('express')
const router = express.Router()
const userRoutes = require('./UserRoutes')
const authRoutes = require('./AuthRoutes')

router.route("/").get((req, res) => {
    res.send(`<H1>Hello desde ${req.baseUrl}</H1>`)
})

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
module.exports = router