const Booking = require('../models/Booking')
const User = require('../models/User')
const BookingStatuses = require('../models/BookingStatus')

const saveBooking = async(booking) => {
    try {        
        const bookingFound = await Booking.findOne({
            accommodation: booking.accommodation,
            guestUser: booking.guestUser,
            bookingStatus: BookingStatuses.CURRENT
        })

        if (booking.hostUser == booking.guestUser){
            throw{ status: 400, message:"No puedes reservar tu propio alojamiento" }
        }

        if(bookingFound){
            throw{ status: 400, message:"Ya tienes una reservación para este alojamiento" }
        }        

        bookingsList = await Booking.find({accommodation: booking.accommodation, bookingStatus: BookingStatuses.CURRENT})

        const bookingBeginDate = new Date(booking.beginningDate);
        const bookingEndDate = new Date(booking.endingDate);
        bookingsList.forEach(element => {
            const elementStartDate = new Date(element.beginningDate);
            const elementEndDate = new Date(element.endingDate);
            if (bookingBeginDate <= elementEndDate && bookingEndDate >= elementStartDate){
                throw{ status: 400, message:"Ya hay una reservación entre esas fechas" }
            }
        });
    

        const newBooking = new Booking(booking)
        const savedBooking = await newBooking.save()

        foundBooking = await Booking.findById({ _id: savedBooking._id}, '-accommodation')
            .populate({
                path: 'hostUser',
                select: '-password'
            })
            .populate({
                path: 'guestUser',
                select: '-password'
            })
            .populate({
                path: 'accommodation',
                select: '-password',
                populate: {
                    path: 'user',
                    select: 'fullName phoneNumber'
                }
            })

        return foundBooking 
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const updateBooking = async(bookingId, accommodation, beginningDate, endingDate, numberOfGuests, totalCost, bookingStatus, guestUserId) => {
    try {         
        //TO-DO : VERIFICAR QUE ESA FEHCAS NO ESTEN RESERVADAS       
        foundBooking = await Booking.findById(bookingId)
        if(!foundBooking) {
            throw{ status: 404, message:"la reservacion no existe " }
        }else{
           
            const usersNames = await getHostAndGuestNames(accommodation._id, guestUserId)
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
    if(!guestUserName){ throw{ status: 400, message:"BNo existe el huesped en la BD" } }
    
    // const accommodationFound = await User.findById(accommodationId)
    // if(!accommodationFound){ throw{ status: 400, message:"El alojamiento no existe" } }

    const hostUserName = await User.findById(guestUserId)
    // if(!hostUserName){ throw{ status: 400, message:"El host no existe" } }

    return {guestUserName, hostUserName}
}

const getBooking = async(bookingId) => {
    try {
        foundBooking = await Booking.findById(bookingId).populate({
            path: 'hostUser',
            select: '-password'
        }).populate({
            path: 'guestUser',
            select: '-password'
        })
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
        foundBookings = await Booking.find({accommodation : accommodationId}, 
        ).populate({
            path: 'hostUser',
            select: '-password'
        }).populate({
            path: 'guestUser',
            select: '-password'
        }).populate({
            path: 'accommodation',
            select: '-multimedias',
            populate:{
                path: 'user',
                select: '-password'
            }
        })
        if(!foundBookings) {
            throw{ status: 404, message:"No hay reservaciones para este alojamiento" }
        }
        return foundBookings
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const getGuestBookings = async (id, status) => {
    try {
        let accommodationsFound
        accommodationsFound = await Booking.find({guestUser:id, bookingStatus:status})
        .select('-guestUser -hostUser')
        .populate({
            path: 'accommodation',
            select: '-multimedias',
            populate:{
                path: 'user',
                select: '-password'
            }
        }) 
        return accommodationsFound
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

const checkOverdueBookings = async() => {
    try {
        const todaysDate = new Date()

        await Booking.updateMany(
            {endingDate: { $lt : todaysDate} },
            { $set : { bookingStatus: BookingStatuses.OVERDUE}}
        )
    } catch (error) {
        throw error;
    }
}

module.exports  = {
    saveBooking, 
    updateBooking,
    getBooking,
    getAllBookingsByAccommodation,
    getGuestBookings,
    deleteBooking,
    checkOverdueBookings
}

