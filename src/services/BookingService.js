const Booking = require('../models/Booking')
const ID_MONGO_DB_SIZE = 24;

const saveBooking = async(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId) => {
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
            return savedBooking
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const updateBooking = async(bookingId, accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId) => {
    try {         
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
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getBooking = async(bookingId) => {
    try {
        foundBooking = await Booking.findById(bookingId)
        //TO-DO FIND Accomodattion data.
        if(!foundBooking) {
            throw{ status: 404, message:"la reservacion no existe " }
        }
        return foundBooking
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getAllBookingsByAccommodation = async (accommodationId)=> {
    try {
        foundBookings = await Booking.find({accommodationId : accommodationId})
        if(!foundBookings) {
            throw{ status: 404, message:"No hay reservaciones para este alojamiento" }
        }
        return {bookings: foundBookings}
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const deleteBooking = async(bookingId) => {
    try {
        const bookingFound = await Booking.findById(bookingId)
        const beginDate =  new Date(bookingFound.beginningDate)               
        const currentDate = new Date()
        const differenceInMilliseconds = beginDate - currentDate;
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        if (differenceInDays <= 1) {
            throw { status: 400, message: "La fecha de inicio es en menos de un día, no se puede cancelar" };
        }
        await Booking.deleteOne({_id : bookingId})    
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

