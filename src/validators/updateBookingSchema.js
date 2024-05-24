const { body, checkSchema, validationResult } = require('express-validator')
const ID_MONGO_DB_SIZE = 24;

const updateBookingSchema ={
    bookingId: {
        exists: {
            errorMessage: 'bookingId cannot be null'
        }, 
        isString: {
            errorMessage: 'bookingId must be a string'
        },
        notEmpty: {
            errorMessage: 'bookingId cannot be empty'
        },           
        custom: {
            options: (value) => value.length === ID_MONGO_DB_SIZE,
            errorMessage: `bookingId is not valid`
        }
    },
    accommodation: {
        exists: {
            errorMessage: 'accommodationId cannot be null'
        }
    },
    beginningDate:{
        exists: {
            errorMessage: 'beginningDate cannot be null'
        },
        notEmpty: {
            errorMessage: 'beginningDate cannot be empty'
        },
        custom: {
            options: (value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            },
            errorMessage: 'beginningngDate must be a valid date'
        }
    },
    endingDate:{
        exists: {
            errorMessage: 'endingDate cannot be null'
        }, 
        notEmpty: {
            errorMessage: 'endingDate cannot be empty'
        },
        custom: {
            options: (value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            },
            errorMessage: 'endingDate must be a valid date'
        }
    },
    numberOfGuests: {
        exists: {
            errorMessage: 'numberOfGuest cannot be null'
        }, 
        isNumeric: {
            errorMessage: 'numberOfGuest must be a string'
        },
        notEmpty: {
            errorMessage: 'numberOfGuest cannot be empty'
        }
    },
    totalCost:{
        exists: {
            errorMessage: 'totalCost cannot be null'
        }, 
        isNumeric: {
            errorMessage: 'totalCost must be a string'
        },
        notEmpty: {
            errorMessage: 'totalCost cannot be empty'
        }
    },
    bookingStatus:{
        exists: {
            errorMessage: 'bookinStatus cannot be null'
        }, 
        isString: {
            errorMessage: 'bookinStatus must be a string'
        },
        notEmpty: {
            errorMessage: 'bookinStatus cannot be empty'
        }
    },
    guestUserId: {
        exists: {
            errorMessage: 'guestUserId cannot be null'
        }, 
        isString: {
            errorMessage: 'guestUserId must be a string'
        },
        notEmpty: {
            errorMessage: 'guestUserId cannot be empty'
        },           
        custom: {
            options: (value) => value.length === ID_MONGO_DB_SIZE,
            errorMessage: `guestUserId is not valid`
        },
    },
}

module.exports = {updateBookingSchema}