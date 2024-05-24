const { body, checkSchema, validationResult } = require('express-validator')
const ID_MONGO_DB_SIZE = 24;

const saveBookingSchema = {
    accommodation: {
        exists: {
            errorMessage: 'accommodation cannot be null'
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
            errorMessage: 'beginningDate must be a valid date'
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
            errorMessage: 'numberOfGuest must be a number'
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
            errorMessage: 'totalCost must be a number'
        },
        notEmpty: {
            errorMessage: 'totalCost cannot be empty'
        }
    },
    bookingStatus:{
        exists: {
            errorMessage: 'bookingStatus cannot be null'
        }, 
        isString: {
            errorMessage: 'bookingStatus must be a string'
        },
        notEmpty: {
            errorMessage: 'bookingStatus cannot be empty'
        }
    },
    guestUser: {
        exists: {
            errorMessage: 'User cannot be null'
        }
    },
    hostUser: {
        exists: {
            errorMessage: 'User cannot be null'
        }
    }
}

module.exports = {
    saveBookingSchema
}