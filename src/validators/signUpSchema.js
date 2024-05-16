const { body, checkSchema, validationResult } = require('express-validator')
const User = require('../models/User')

const signUpSchema = {
    email: {
        exists: {
            errorMessage: 'Email cannot be null'
        }, 
        isString: {
            errorMessage: 'Email must be a string'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
    },
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
        }, 
        isDate: {
            errorMessage: 'Birth date must be a valid date'
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
    },
    password: {
        exists: {
            errorMessage: 'Password cannot be null'
        }, 
        isString: {
            errorMessage: 'Password must be a string'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            errorMessage: 'Password must be greater than 8 and contain at least one upper...'
        },

    }
}

module.exports = { signUpSchema }