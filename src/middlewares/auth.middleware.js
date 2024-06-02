const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const ClaimTypes = require('../config/claimtypes');
const {sign} = require('../security/Jwt');

const Authorize = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, jwtSecret);
            const userRoles = decodedToken[ClaimTypes.Role];
            const requiredRolesArray = requiredRoles.split(',');

            const hasRequiredRole = requiredRolesArray.some(role => userRoles.includes(role));
            if (!hasRequiredRole) {
                return res.status(401).json({ message: 'Forbidden' });
            }

            req.decodedToken = decodedToken;

            const minutesRemaining = (decodedToken.exp - (new Date().getTime() / 1000)) / 60;
            if (minutesRemaining < 5) {
                const newToken = sign(decodedToken[ClaimTypes.Name], decodedToken[ClaimTypes.GivenName], userRoles);
                res.header("Set-Authorization", `Bearer ${newToken}`);
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

module.exports = Authorize
