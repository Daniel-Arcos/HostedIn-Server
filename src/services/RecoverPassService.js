const { token } = require('morgan')
const User = require('../models/User')
const PasswordCodes = require('../models/PasswordCode')
const Jwt = require('../Security/Jwt')
const RecoverPassUtils = require('../utils/RecoverPasswordUtils')

const sendEmailCode = async (email) => {
    try{
        const userFound = await User.findOne({email: email})
        if(!userFound){
            console.log("Email no pertenece a nadie.")
            throw {
                status: 404,
                message: "Correo electrónico no encontrado"
            }
        }
        else{
            console.log("Email encontrado. Existe.")
            const currentCode = await PasswordCodes.findOne({ email: email });
            if(currentCode){                
                if (RecoverPassUtils.is10MinutesAgo(currentCode.inssuanceDate)) {                    
                    console.log("Ya pasaron 10 min, genera otro.")
                    await RecoverPassUtils.sendEmail(email, currentCode)
                }
                else{
                    console.log("Aun no han pasado 10 minutos, codigo pendiente.")
                    throw {
                        status: 200,
                        message: "Existe un codigo de recuperacion vigente."
                    }
                }               
            }   
            else{                
                console.log("No hay registro de codigo de password.")
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
                console.log("Ya caduco el codigo, genera otro.")
                throw {
                    status: 400,
                    message: "Codigo expirado, Genere otro"
                }
            }
            else{
                console.log("Codigo correcto")
                const token = Jwt.confirmEmailCode(codeFound.code)
                console.log(token)
                return token
            }
        }
        else{
            console.log("codigo incorrecto")
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
            console.log(userFound.password)
            await userFound.save()            
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