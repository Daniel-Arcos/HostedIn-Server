const Booking = require('../models/Booking')
const Jwt = require('../Security/Jwt')

const saveBooking = async(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId, userId) => {
    try {        
        const bookingFound = await Booking.findOne({accommodationId: accommodationId, guestUserId: guestUserId})
        if(bookingFound){
            throw{ status: 400, message:"Y existe una reservacion de este usuario para este alojamiento" }
        }
        //TO-DO : VERIFICAR QUE ESA FEHCAS NO ESTEN RESERVADAS
        else{
            const newBooking = new Booking({
                accommodationId, 
                beginningDate, 
                endingDate,
                numberOfGuests,
                totalCost, 
                bookingStatus,
                guestUserId
            })

            const savedBooking = await newBooking.save()
            const token = Jwt.sign(userId);
            return [savedBooking,token]
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const updateBooking = async(bookingId, accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId, userId) => {
    try {
        if (typeof bookingId !== 'string' || bookingId.trim() === '' || bookingId.length !== ID_MONGO_DB_SIZE) {
            throw { status: 400, message: "El ID proporcionado no es válido." }
        }         
        //TO-DO : VERIFICAR QUE ESA FEHCAS NO ESTEN RESERVADAS       
        foundBooking = await Booking.findById(bookingId)
        if(!foundBooking) {
            throw{ status: 404, message:"la reservacion no existe " }
        }else{
           
            foundBooking.beginningDate = beginningDate 
            foundBooking.endingDate = endingDate
            foundBooking.numberOfGuests = numberOfGuests
            foundBooking.totalCost = totalCost 
            foundBooking.bookingStatus = bookingStatus
            
            await foundBooking.save()            
            const token = Jwt.sign(userId)
            return token
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getBooking = async(bookingId, userId) => {
    try {
        if (typeof bookingId !== 'string' || bookingId.trim() === '' || bookingId.length !== ID_MONGO_DB_SIZE) {
            throw { status: 400, message: "El ID proporcionado no es válido." }
        }
        foundBooking = await Booking.findById(bookingId)
        if(!foundBooking) {
            throw{ status: 404, message:"la reservacion no existe " }
        }
        const token = Jwt.sign(userId)
        return [foundBooking, token]
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getAllBookingsByAccommodation = async (accommodationId, userId)=> {
    try {
        if (typeof accommodationId !== 'string' || accommodationId.trim() === '' || accommodationId.length !== ID_MONGO_DB_SIZE) {
            throw { status: 400, message: "El ID proporcionado no es válido." }
        }
        foundBookings = await Booking.find({idAccommodation : idAccommodation})
        if(!foundBooking) {
            throw{ status: 404, message:"No hay reservaciones para este alojamiento" }
        }
        const token = Jwt.sign(userId)
        return {bookings: foundBookings, token}
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const deleteBooking = async(bookingId) => {
    try {
        if (typeof bookingId !== 'string' || bookingId.trim() === '' || bookingId.length !== ID_MONGO_DB_SIZE) {
            throw { status: 400, message: "El ID proporcionado no es válido." }
        }
        const bookingFound = await Booking.findById(bookingId)
        const beginDate =  new Date(bookingFound.beginningDate)               
        const currentDate = new Date()
        const differenceInMilliseconds = beginDate - currentDate;
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        if (differenceInDays <= 1) {
            throw { status: 400, message: "La fecha de inicio es en menos de un día, no se puede cancelar" };
        }
        await Booking.deleteOne({idAccommodation : idAccommodation})    
        const token = Jwt.sign(userIde)
        return token
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports  = {
    saveBooking, 
    updateBooking,
    getBooking,
    getAllBookingsByAccommodation,
    deleteBooking
}

