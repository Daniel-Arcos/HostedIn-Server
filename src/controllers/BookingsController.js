const BookingService = require('../services/BookingService')
const BookingStatus = require('../models/BookingStatus')
const Jwt = require('../Security/Jwt')
const { validationResult } = require('express-validator')
const ConsultorTypes = {
    HOST : "Host",
    GUEST: "Guest"
}


const createBooking = async(req, res) =>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw { status : 400,
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId"
            }
        }
        const {accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId, guestName, hostName} = req.body        
        const beginDate =  new Date(beginningDate)
        const endDate = new Date(endingDate)        
        const currentDate = new Date()
        if (beginDate > endDate) {
            throw{ status: 400, message:"La fecha de inicio es psoterior a la de termino" }
        }
        if(beginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        }
       
        result = await BookingService.saveBooking(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, BookingStatus.CURRENT, guestUserId, guestName, hostName)
        const documentBookingJson = result.toJSON()
        res.status(200).send({
            message: "Reservacion creada exitosamente",
            booking: result
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
} 

const editBooking = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw { status : 400,
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId"
            }
        }
        const bookingId = req.params.bookingId
        const {accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId} = req.body
        const beginDate =  new Date(beginningDate)
        const endDate = new Date(endingDate)
        const currentDate = new Date()
        if (beginDate > endDate) {
            throw{ status: 400, message:"La fecha de inicio es psoterior a la de termino" }
        }
        if(beginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        } 
        await BookingService.updateBooking(bookingId,accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, BookingStatus.CURRENT, guestUserId)
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
        const bookingId = req.params.bookingId
        if (bookingId === null) {
            return res.status(400).send({error: "El id viene nulo"})
        }               
        result = await BookingService.getBooking(bookingId) 
        res.status(200).send({
            message: "Reservacion recuperada exitosamente",
            booking: result
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const getBookingByAccommodationId = async(req, res) => {
    try {
        const accommodationId = req.params.accommodationId
        if (accommodationId === null) {
            return res.status(401).send({error: "El ID viene nulo"})
        }               
        allBookingsFound = await BookingService.getAllBookingsByAccommodation(accommodationId)        
        let bookingsArray = Array.isArray(allBookingsFound.bookings) ? allBookingsFound.bookings : [];
        const bookingStatus = req.query.status
        let result
        if(bookingStatus){
            filteredArray = filterBookingsByStatus(bookingStatus, bookingsArray)
            result = filteredArray.map(booking => booking.toJSON())
        }else{
            result = allBookingsFound
        }
        res.status(200).send({
            bookingsList: result          
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

function filterBookingsByStatus(status, bookings){
    let filteredBookings    
    if (status === BookingStatus.CURRENT) {
        filteredBookings = bookings.filter(booking => booking.bookingStatus === BookingStatus.CURRENT)
    } else {
        filteredBookings = bookings.filter(booking => booking.bookingStatus === BookingStatus.OVERDUE)
    }
    return filteredBookings
}

const deleteBookingById = async(req, res) => {
    try {        
        // const authorization = req.headers.authorization;  
        // if (!authorization) {
        //     throw { status: 401, message: 'Authorization header is missing' };
        // }      
        // Jwt.verifyToken(authorization) 

        const bookingId = req.params.bookingId
        if (bookingId === null) {
            return res.status(400).send({error: "El viene nulo"})
        }
        await BookingService.deleteBooking(bookingId)
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



