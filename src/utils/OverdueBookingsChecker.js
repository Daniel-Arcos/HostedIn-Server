const cron = require('node-cron')
const bookingController = require('../controllers/booking.controller')

cron.schedule('0 0 */12 * * *',() =>{
    bookingController.checkOverdueBookigns()
    console.log("Ejecutando task cron")
})