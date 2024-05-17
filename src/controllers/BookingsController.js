const BookingService = require('../services/BookingService')
const BookingStatus = require('../models/BookingStatus')
const Jwt = require('../Security/Jwt')


const createBooking = async(req, res) =>{
    try {
        //schema de verificaicon de campos nulos
        const {accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId} = req.body
        //TO-DO Obtener userId: userId = 
        const beginDate =  new Date(beginningDate)
        const endDate = new Date(endingDate)        
        const currentDate = new Date()
        if (beginDate > endDate) {
            throw{ status: 400, message:"La fecha de inicio es psoterior a la de termino" }
        }
        if(beginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        }
        result = await BookingService.saveBooking(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, BookingStatus.CURRENT, guestUserId, userId)
        const documentBookingJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Reservacion creada exitosamente",
            booking: {
                accommodationId : documentBookingJson.accommodationId,
                beginningDate : documentBookingJson.beginningDate,
                endingDate : documentBookingJson.endingDate,
                numberOfGuests : documentBookingJson.numberOfGuests,
                totalCost : documentBookingJson.totalCost ,
                bookingStatus : documentBookingJson.bookingStatus,
                guestUserId : documentBookingJson.guestUserId              
            }
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
} 

const editBooking = async(req, res) => {
    try {
        //schema de verificaicon de campos nulos
        const {accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId} = req.body
        //TO-DO Obtener userId: userId =
        const beginDate =  new Date(beginningDate)
        const endDate = new Date(endingDate)
        const currentDate = new Date()
        if (beginDate > endDate) {
            throw{ status: 400, message:"La fecha de inicio es psoterior a la de termino" }
        }
        if(beginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        } 
        result = await BookingService.updateBooking(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, BookingStatus.CURRENT, guestUserId, userId)
        
        res.header('Authorization', `Bearer ${result}`);
        res.status(200).send({
            message: "Reservacion actualizada exitosamente"
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const getBookingById = async(req, res) => {
    try {
        //schema de verificaicon de campos nulos
        const bookingId = req.params.bookingId
        if (bookingId == null) {
            return res.status(400).send({error: "El id viene nulo"})
        }
        //TO-DO Obtener userId: userId =
        result = await BookingService.getBooking(bookingId, userId)
        
        //const documentBookingJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Reservacion recuperada exitosamente",
            booking: result[0]
            // {
            //     accommodationId : documentBookingJson.accommodationId,
            //     beginningDate : documentBookingJson.beginningDate,
            //     endingDate : documentBookingJson.endingDate,
            //     numberOfGuests : documentBookingJson.numberOfGuests,
            //     totalCost : documentBookingJson.totalCost ,
            //     bookingStatus : documentBookingJson.bookingStatus,
            //     guestUserId : documentBookingJson.guestUserId              
            // }
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const getBookingByAccommodationId = async(req, res) => {
    try {
        //schema de verificaicon de campos nulos
        const accommodationId = req.params.accommodationId
        if (accommodationId == null) {
            return res.status(400).send({error: "El  viene nulo"})
        }
        //TO-DO Obtener userId: userId =
        result = await BookingService.getBookingByAccommodationId(accommodationId, userId)
        
        //const documentBookingJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Reservaciones recuperadas exitosamente",
            bookings: result.bookings.map(booking => booking.toJSON)           
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const deleteBookingById = async(req, res) => {
    try {        
        const bookingId = req.params.bookingId
        if (bookingId == null) {
            return res.status(400).send({error: "El viene nulo"})
        }
        //TO-DO Obtener userId: userId =
        result = await BookingService.deleteBooking(bookingId, userId)
        res.header('Authorization', `Bearer ${result}`);
        res.status(200).send({
            message: "Reservacion eliminada exitosamente",         
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    createBooking,
    editBooking,
    getBookingById,
    getBookingByAccommodationId,
    deleteBookingById
}



