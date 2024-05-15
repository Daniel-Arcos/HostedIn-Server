const config = require('../config')
const jwt = require('jsonwebtoken')

const sign = (id) => {
    return jwt.sign({id: id}, config.SECRET, {
        expiresIn: 86400
    })
}

const confirmEmailCode = (code) => {
    return jwt.sign({code :code}, config.SECRET, {
        expiresIn: 86400
    })
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.SECRET);
        return decoded;
    } catch (error) {
        throw {
            status: 401,
            message: "Token no valido"
        }
    }
};

module.exports = {
    sign,
    confirmEmailCode,
    verifyToken
}