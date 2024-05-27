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
        }

    },
}

module.exports = {signInSchema}