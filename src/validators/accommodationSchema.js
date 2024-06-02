const { body, checkSchema, validationResult } = require('express-validator')
const Accommodation = require('../models/Accommodation')

const accommodationSchema = {
    title: {
        exists: {
            errorMessage: 'Title cannot be null'
        },
        isString: {
            errorMessage: 'Title must be a string'
        },
        notEmpty: {
            errorMessage: 'Title cannot be empty'
        }
    },
    description: {
        exists: {
            errorMessage: 'Description cannot be null'
        },
        isString: {
            errorMessage: 'Description must be a string'
        },
        notEmpty: {
            errorMessage: 'Description cannot be empty'
        }
    },
    rules: {
        isString: {
            errorMessage: 'Rules must be a string'
        }
    },
    accommodationType: {
        exists: {
            errorMessage: 'Accommodation type cannot be null'
        },
        isString: {
            errorMessage: 'Accommodation type must be a string'
        },
        notEmpty: {
            errorMessage: 'Accommodation type cannot be empty'
        }
    },
    nightPrice: {
        exists: {
            errorMessage: 'Night price cannot be null'
        },
        isNumeric: {
            errorMessage: 'Night price must be a number'
        }
    },
    guestsNumber: {
        exists: {
            errorMessage: 'Guests number cannot be null'
        },
        isNumeric: {
            errorMessage: 'Guests number must be a number'
        }
    },
    roomsNumber: {
        exists: {
            errorMessage: 'Rooms number cannot be null'
        },
        isNumeric: {
            errorMessage: 'Rooms number must be a number'
        }
    },
    bedsNumber: {
        exists: {
            errorMessage: 'Beds number cannot be null'
        },
        isNumeric: {
            errorMessage: 'Beds number must be a number'
        }
    },
    bathroomsNumber: {
        exists: {
            errorMessage: 'Bathrooms number cannot be null'
        },
        isNumeric: {
            errorMessage: 'Bathrooms number must be a number'
        }
    },
    accommodationServices: {
        isArray: {
            errorMessage: 'Accommodation services must be an array'
        }
    },
    location: {
        exists: {
            errorMessage: 'Location cannot be null'
        },
        isObject: {
            errorMessage: 'Location must be an object'
        },
        custom: {
            options: (value) => {
                if (!value.latitude || !value.longitude) {
                    return false;
                }
                return true;
            },
            errorMessage: 'Location must have a latitude and longitude'
        }
    },
    'location.latitude': {
        isFloat: {
            options: { min: -90, max: 90 },
            errorMessage: 'Latitude must be a number between -90 and 90'
        }
    },
    'location.longitude': {
        isFloat: {
            options: { min: -180, max: 180 },
            errorMessage: 'Longitude must be a number between -180 and 180'
        }
    },
    user: {
        exists: {
            errorMessage: 'User cannot be null'
        }
    }
}

module.exports = { accommodationSchema }