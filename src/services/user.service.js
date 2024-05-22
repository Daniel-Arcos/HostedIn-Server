const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../security/Jwt')
const PasswordCodes = require('../models/PasswordCode')
const RecoverPassUtils = require('../utils/RecoverPasswordUtils')
const MailSender = require('../utils/MailSender')

const ID_MONGO_DB_SIZE = 24;

const getUser = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        const userFound = await User.findById(userId).populate('roles');

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }
        return userFound

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const editAccount = async (userId, userToEdit) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }
        if (userToEdit.password) {
            userToEdit.password = await User.encryptPassword(userToEdit.password)
        }
        const userFound = await User.findByIdAndUpdate(userId, userToEdit, {
            new: true,
        }).populate('roles');

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }
        return userFound
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const deleteAccount = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        const userFound = await User.findById(userId);

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }

        const deletedUser = await User.deleteOne({ _id: userId });

        if (deletedUser.deletedCount === 0) {
            throw {
                status: 500,
                message: "Error al eliminar el usuario. Inténtelo de nuevo más tarde."
            };
        }

        return deletedUser;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const sendUserCode = async (email) => {
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
                    await sendEmail(email, currentCode)
                }
                else{
                    throw {
                        status: 200,
                        message: "Existe un codigo de recuperacion vigente."
                    }
                }               
            }   
            else{                
                await sendEmail(email)
            }                    
        }
    }catch(error){
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

async function sendEmail(email, codeRegistry){
    const code = RecoverPassUtils.generateRandomCode()
    try {
        const emailWasSend = await MailSender.sendCodeVerificacion(email, code)
        if(emailWasSend){   
            let newPasswordCode                 
            const inssuanceDate = new Date()  
            if(codeRegistry == null){       
                newPasswordCode = new PasswordCodes({
                    email,
                    code, 
                    inssuanceDate
                })              
            }
            else{
                newPasswordCode = codeRegistry
                newPasswordCode.code = code
                newPasswordCode.inssuanceDate = inssuanceDate   
            }       
            await newPasswordCode.save();   
        }
    else{
        throw {
            status: 400,
            message: "Email no enviado"
        }
    } 
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
    
}

const verifyUserCode = async (code) => {
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

const updateUserPassword = async (newPassword, email) => {
    try {
        const userFound = await User.findOne({email: email})
        if(userFound){
            userFound.password =  await User.encryptPassword(newPassword)          
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
    editAccount, 
    getUser,
    deleteAccount,
    sendUserCode, 
    verifyUserCode, 
    updateUserPassword
}