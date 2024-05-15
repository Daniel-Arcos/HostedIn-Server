const RecoverPassService = require('../services/RecoverPassService')
const Jwt = require('../Security/Jwt')

const sendEmailCode = async(req, res) => {
    try {
        const {content} = req.body
        if (!content) {
            throw {
                status: 400,
                message: "Falta el campo correo"
            }
        }
        const email = content
        result = await RecoverPassService.sendEmailCode(email)               
        res.header('Authorization')
        res.status(200).send({
            message:"Codigo enviado exitosamente"
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const verifyEmailCode = async(req, res) => {
    try {
        const { content } = req.body
        if(!content) {
            throw {
                status: 400,
                message: "Falta el campo codigo"
            }
        }
        const code = content
        result = await RecoverPassService.verifyCodeToRecoverPassword(code)
        res.header('Authorization', `Bearer ${result}`)    
        res.status(200).send({
            message:"Codigo correcto"
        })      
    }
    catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

const changePasswordByCode = async(req, res) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw { status: 401, message: 'Authorization header is missing' };
        }      
        const decodedToken = Jwt.verifyToken(authorization);        
        if (!decodedToken) {
            throw { status: 401, message: 'Invalid token' };
        }          
        const {newPassword, email} = req.body 
        await RecoverPassService.changePasswordByCodeRecover(newPassword, email)
        res.status(200).send({
            message:"Contaseña actualizada correctamente"
        })        
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    sendEmailCode,
    verifyEmailCode,
    changePasswordByCode
}