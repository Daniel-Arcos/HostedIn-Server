const Role = require('../models/Role')

const getAll = async () => {
    try {
        return Role.find()
    } catch (error) {
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
    }
}

module.exports = {
    getAll
}