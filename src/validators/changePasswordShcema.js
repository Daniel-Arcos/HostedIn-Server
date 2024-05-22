const { body, checkSchema, validationResult } = require('express-validator')

const changePasswordSchema = {
    newPassword: {
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
        }
    },
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
            errorMessage: 'Email must be a valid email address'
        }
    }
}

module.exports = {changePasswordSchema}