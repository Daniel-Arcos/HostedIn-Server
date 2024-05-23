const { body, checkSchema, validationResult } = require('express-validator')

const saveCancellationSchema = {
    cancellationDate: {
        exists: {
            errorMessage: 'date cannot be null'
        },
        notEmpty: {
            errorMessage: 'date cannot be empty'
        },
        custom: {
            options: (value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            },
            errorMessage: 'beginningDate must be a valid date'
        }
    },
    reason: {
        exists: {
            errorMessage: 'reviewDescription cannot be null'
        },
        notEmpty: {
            errorMessage: 'reviewDescription cannot be empty'
        },
        isString:{
            errorMessage: 'reviewDescription must be String'
        }
    },
    cancellator: {
        exists: {
            errorMessage: 'Cancellator cannot be null'
        }
    },
    booking: {
        exists: {
            booking: 'Cancellator cannot be null'
        }
    }
}

module.exports = {
    saveCancellationSchema
}