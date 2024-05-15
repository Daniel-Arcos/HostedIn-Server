const { token } = require('morgan')
const User = require('../models/User')
const PasswordCodes = require('../models/PasswordCode')
const Jwt = require('../Security/Jwt')
const RecoverPassUtils = require('../utils/RecoverPasswordUtils')

const sendEmailCode = async (email) => {
    try{
        const userFound = await User.findOne({email: email})
        if(!userFound){
            throw {
                status: 404,
                message: "Correo electrónico no encontrado"
            }
        }
        else{
            const currentCode = await PasswordCodes.findOne({ email: email });
            if(currentCode){                
                if (RecoverPassUtils.is10MinutesAgo(currentCode.inssuanceDate)) {  
                    await RecoverPassUtils.sendEmail(email, currentCode)
                }
                else{
                    throw {
                        status: 200,
                        message: "Existe un codigo de recuperacion vigente."
                    }
                }               
            }   
            else{                
                await RecoverPassUtils.sendEmail(email)
            }                    
        }
    }catch(error){
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const verifyCodeToRecoverPassword = async (code) => {
    try {
        const codeFound = await PasswordCodes.findOne({ code: code })
        if(codeFound){
            if (RecoverPassUtils.is10MinutesAgo(codeFound.inssuanceDate)) {  
                throw {
                    status: 400,
                    message: "Codigo expirado, Genere otro"
                }
            }
            else{
                const token = Jwt.confirmEmailCode(codeFound.code)
                return token
            }
        }
        else{
            throw {
                status: 401,
                message: "Codigo incorrecto"
            }
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const changePasswordByCodeRecover = async (newPassword, email) => {
    try {
        const userFound = await User.findOne({email: email})
        if(userFound){
            userFound.password = await User.encryptPassword(newPassword)            
            await userFound.save() 
            await PasswordCodes.deleteOne({email : email})           
        }
        else{
            throw {
                status: 404,
                message: "Correo electrónico no encontrado"
            }
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}


module.exports = {
    sendEmailCode, 
    verifyCodeToRecoverPassword,
    changePasswordByCodeRecover
}