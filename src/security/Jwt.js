const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')

const sign = (email, name, roles) => {
    const token = jwt.sign({
        [ClaimTypes.Name] : email,
        [ClaimTypes.GivenName]: name,
        [ClaimTypes.Role]: roles,
        "iss": "JWTHostedInServer",
        "aud": "JWTHostedInClients"
    },
        jwtSecret, {
            expiresIn: '20m'
    })
    return token;
}

const confirmEmailCode = (code) => {
    return jwt.sign({code :code}, jwtSecret, {
        expiresIn: 600
    })
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
    } catch (error) {
        throw {
            status: 400,
            message: "Token no valido"
        }
    }
};

const leftTime = (req) => {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, jwtSecret)

        const time = (decodedToken.exp - (new Date().getTime()/ 1000))
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time - minutes * 60)
        return "00:" + minutes.toString().padStart(2, "0") + ':' + seconds.toString().padStart(2, "0")
    } catch (error) {
        return null
    }
}

module.exports = {
    sign,
    confirmEmailCode,
    verifyToken,
    leftTime
}