const Booking = require('../models/Booking')
const User = require('../models/User')
const ID_MONGO_DB_SIZE = 24;

const saveBooking = async(accommodationId, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId) => {
    try {        
        const bookingFound = await Booking.findOne({accommodationId: accommodationId, guestUserId: guestUserId})
        if(bookingFound){
            throw{ status: 400, message:"Y existe una reservacion de este usuario para este alojamiento" }
        }        
        //TO-DO : VERIFICAR QUE ESA FEHCAS NO ESTEN RESERVADAS               
        const usersNames = await getHostAndGuestNames(accommodationId, guestUserId)
        const newBooking = new Booking({
            accommodationId, 
            beginningDate, 
            endingDate,
            numberOfGuests,
            totalCost, 
            bookingStatus,
            guestUserId,
            guestName: usersNames.guestUserName.fullName,
            hostName: "usersNames"
        })

        const savedBooking = await newBooking.save()
        return savedBooking
        
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
           
            const usersNames = await getHostAndGuestNames(accommodationId, guestUserId)
            foundBooking.beginningDate = beginningDate 
            foundBooking.endingDate = endingDate
            foundBooking.numberOfGuests = numberOfGuests
            foundBooking.totalCost = totalCost 
            foundBooking.bookingStatus = bookingStatus
            foundBooking.guetName = usersNames.guestUserName.fullName
            foundBooking.hostName = "usersNames"
            
            await foundBooking.save()     
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}


async function getHostAndGuestNames(accommodationId, guestUserId){
    const guestUserName = await User.findById(guestUserId)
    if(!guestUserName){ throw{ status: 400, message:"BNo existe el husped ne la BD" } }
    
    // const accommodationFound = await User.findById(accommodationId)
    // if(!accommodationFound){ throw{ status: 400, message:"El alojamiento no existe" } }

    const hostUserName = await User.findById(guestUserId)
    // if(!hostUserName){ throw{ status: 400, message:"El host no existe" } }

    return {guestUserName, hostUserName}
}

const getBooking = async(bookingId) => {
    try {
        foundBooking = await Booking.findById(bookingId)
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

