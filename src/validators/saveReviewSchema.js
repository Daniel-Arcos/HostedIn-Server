const { body, checkSchema, validationResult } = require('express-validator')

const saveReviewSchema = {
    accommodation: {
        exists: {
            errorMessage: 'accommodation cannot be null'
        }
    },
    reviewDescription:{
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
    rating:{
        exists: {
            errorMessage: 'ratiing cannot be null'
        }, 
        notEmpty: {
            errorMessage: 'ratiing cannot be empty'
        },
        isNumeric:{
            errorMessage: 'ratiing must be Number'
        }
    },
    guestUser: {
        exists: {
            errorMessage: 'User cannot be null'
        }
    }
}

module.exports = {saveReviewSchema}