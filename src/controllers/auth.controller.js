const { token } = require('morgan')
const UserService = require('../services/auth.service')
const { validationResult } = require('express-validator');
const { leftTime } = require('../security/Jwt');

const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Hay un error en la petición."
            }); 
        }
        const {email, fullName, birthDate, phoneNumber, password, roles} = req.body
        
        result = await UserService.createAccount(email, fullName, birthDate, phoneNumber, password, roles);
        const documentoUserJson = result[0]
        res.header('Authorization', `Bearer ${result[1]}`);
        console.log(documentoUserJson)
        return res.status(200).send({
            message: "Cuenta creada exitosamente",
            user: {
                _id: documentoUserJson._id,
                email: documentoUserJson.email,
                fullName: documentoUserJson.fullName,
                roles: documentoUserJson.roles.map(role => role.name)
            }
        })
    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }


}
const signIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Hay un error en la petición."
            }); 
        }
        const {email, password} = req.body;

        result = await UserService.signIn(email, password);
        const documentoUserJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        return res.status(200).send({
            message: "Inicio de sesion exitoso",
            user: {
                _id: documentoUserJson._id,
                email: documentoUserJson.email,
                fullName: documentoUserJson.fullName,
                roles: documentoUserJson.roles.map(role => role.name)
            }
        })
    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const time = async (req, res) => {
    const time = leftTime(req)
    if (time == null)
        return res.status(404).send()
    return res.status(200).send(time)
}

module.exports = {
    signUp,
    signIn,
    time
}
