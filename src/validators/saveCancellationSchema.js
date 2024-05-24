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
            errorMessage: 'date must be a valid date'
        }
    },
    reason: {
        exists: {
            errorMessage: 'reason cannot be null'
        },
        notEmpty: {
            errorMessage: 'reason cannot be empty'
        },
        isString:{
            errorMessage: 'reason must be String'
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