const Cancellation = require("../models/Cancellation")
const Booking = require("../models/Booking")
const BookingStatus = require("../models/BookingStatus")
const { populate } = require("../models/User")

const createCancellation = async (cancellation) => {
    try {
        const cancellationFound = await Cancellation.findOne({booking: cancellation.booking})
    if (cancellationFound) {
        throw {
            status: 400,
            message: "La reservacion ya fue cancelada anteriormente"
        }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        cancellation.booking,
        { bookingStatus: BookingStatus.CANCELLED},
        { new: true }
    )

    const newCancellation = await Cancellation.create(cancellation)
    const cancellationPopulated = await Cancellation.findById(newCancellation._id)
        .populate({
            path: 'booking',
            select: '-guestUser -hostUser',
            populate: {
                path: 'accommodation',
                select: '-description -rules -guestsNumber -roomsNumber -bedsNumber -bathroomsNumber -accommodationServices -multimedias ',
                populate: {
                    path: 'user',
                    select: 'fullName phoneNumber'
                }
            }
        })
        .select('-cancellator')

    return cancellationPopulated
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = {
    createCancellation
}