const { body, checkSchema, validationResult } = require('express-validator')

const updateUserSchema = {
    fullName: {
        exists: {
            errorMessage: 'Name cannot be null'
        }, 
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        }
    },
    birthDate: {
        exists: {
            errorMessage: 'Birth date cannot be null'
        }
    },
    phoneNumber: {
        exists: {
            errorMessage: 'Phone number cannot be null'
        }, 
        isString: {
            errorMessage: 'Phone number must be a string'
        },
        notEmpty: {
            errorMessage: 'Phone number cannot be empty'
        }
    }
}

module.exports = { updateUserSchema }