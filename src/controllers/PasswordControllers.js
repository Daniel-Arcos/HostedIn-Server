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
        console.log(email)
        result = await RecoverPassService.sendEmailCode(email)               
        res.header('Authorization')
        res.status(200).send({
            message:"Codigo enviado exitosamente"
        })
    } catch (error) {
        console.log(error)
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
        console.log(code)
        result = await RecoverPassService.verifyCodeToRecoverPassword(code)
        res.header('Authorization', `Bearer ${result}`)    
        res.status(200).send({
            message:"Codigo correcto"
        })      
    }
    catch (error) {
        console.log(error)
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
        const token = authorization.split(' ')[1];
        console.log(token)
        const decodedToken = Jwt.verifyToken(token);        
        if (!decodedToken) {
            throw { status: 401, message: 'Invalid token' };
        }          
        const {newPassword, email} = req.body 
        await RecoverPassService.changePasswordByCodeRecover(newPassword, email)
        console.log("contraseña cambiada con exito")
        res.status(200).send({
            message:"Contaseña actualizada correctamente"
        })
        
    } catch (error) {
        console.log(error)
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