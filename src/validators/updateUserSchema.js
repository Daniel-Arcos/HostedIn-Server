const { body, checkSchema, validationResult } = require('express-validator')

const updateUserSchema = {
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
        custom: {
            options: (value) => {
                return !isNaN(Date.parse(value));
            },
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
        },
        isMobilePhone: {
            errorMessage: 'Phone number must have a phone format'
        }
    },
    password: {
        optional: { options: { nullable: true, checkFalsy: true } },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            },
            errorMessage: 'Password must be greater than 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
        }
    }
}

module.exports = { updateUserSchema }