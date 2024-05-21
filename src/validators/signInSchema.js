const { body, checkSchema, validationResult } = require('express-validator')

const signInSchema = {
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
        isEmail: {
            errorMessage: 'Email must have a email format'
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

    },
}

module.exports = {signInSchema}