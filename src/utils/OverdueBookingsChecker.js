const cron = require('node-cron')
const bookingController = require('../controllers/booking.controller')

cron.schedule('*/5 * * * *',() =>{
    bookingController.checkOverdueBookigns()
    console.log("Ejecutando task cron")
})