const config = require('../config')
const jwt = require('jsonwebtoken')

const sign = (id) => {
    return jwt.sign({id: id}, config.SECRET, {
        expiresIn: 86400
    })
}

module.exports = {
    sign
}