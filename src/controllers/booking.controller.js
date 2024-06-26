const BookingService = require('../services/booking.service')
const BookingStatus = require('../models/BookingStatus')
const Jwt = require('../security/Jwt')
const { validationResult } = require('express-validator')
const ConsultorTypes = {
    HOST : "Host",
    GUEST: "Guest"
}

const createBooking = async(req, res, next) =>{
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: accommodation, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId"
            })
        }
        const { beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus} = req.body
        
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        if (beginningDate > endingDate) {
            throw{ status: 400, message:"La fecha de inicio es posterior a la de termino" }
        }
        const bookingBeginDate = new Date(beginningDate);
        if(bookingBeginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        }

        const newBooking = {
            accommodation: req.body.accommodation,
            beginningDate,
            endingDate,
            numberOfGuests,
            totalCost,
            bookingStatus,
            guestUser: req.body.guestUser,
            hostUser: req.body.hostUser
        }
        
        result = await BookingService.saveBooking(newBooking)

        return res.status(201).send({
            message: "Reservacion creada con éxito",
            booking: result
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
} 

const editBooking = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId"
            })
        }
        const bookingId = req.params.bookingId
        const {accommodation, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId} = req.body
        const beginDate =  new Date(beginningDate)
        const endDate = new Date(endingDate)
        const currentDate = new Date()
        if (beginDate > endDate) {
            throw{ status: 400, message:"La fecha de inicio es psoterior a la de termino" }
        }
        if(beginDate < currentDate){
            throw{ status: 400, message:"La fecha de inicio es previa a la fecha actual" }
        } 
        await BookingService.updateBooking(bookingId, accommodation, beginningDate, endingDate, numberOfGuests, totalCost, BookingStatus.CURRENT, guestUserId)
        res.status(200).send({
            message: "Reservacion actualizada exitosamente"
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const getBookingById = async(req, res, next) => {
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
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const getBookingByAccommodationId = async(req, res, next) => {
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
        
        return res.status(200).send({
            message: "Reservaciones recuperadas correctamente",
            bookings: result          
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
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

const deleteBookingById = async(req, res, next) => {
    try {        
        const bookingId = req.params.bookingId
        if (bookingId === null) {
            return res.status(400).send({error: "El viene nulo"})
        }
        await BookingService.deleteBooking(bookingId)
        return res.status(200).send({
            message: "Reservacion eliminada exitosamente",         
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const getGuestBookings = async (req, res, next) => {
    try {
        const userId= req.params.userId
        const {status} = req.query
        let bookings
        if(status === undefined){
            return res.status(400).send({error: "El status viene nulo"})
        }
       if(status === BookingStatus.CURRENT){
            bookings = await BookingService.getCurrentGuestBookings(userId)
        }
        else{
            bookings = await BookingService.getOverdueGuestBookings(userId)
        }
        return res.status(200).send({
            message:"Reservaciones recuperadas exitosamente",
            bookings})
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }   
}

const checkOverdueBookigns = async() =>{
    try {
        await BookingService.checkOverdueBookings()
      
    } catch (error) {
        console.log(error)
    } 
}

module.exports = {
    createBooking,
    getBookingById,
    getBookingByAccommodationId,
    getGuestBookings, 
    checkOverdueBookigns
}



