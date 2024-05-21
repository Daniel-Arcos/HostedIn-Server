const Role = require('../models/Role')

const getAll = async () => {
    try {
        return Role.find()
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = {
    getAll
}