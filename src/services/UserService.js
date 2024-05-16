const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../Security/Jwt')
const PasswordCodes = require('../models/PasswordCode')
const RecoverPassUtils = require('../utils/RecoverPasswordUtils')

const ID_MONGO_DB_SIZE = 24;

const getUser = async (userId) => {
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

        const token = Jwt.sign(userFound._id);

        return [userFound, token];
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

        const userFound = await User.findById(userId);

        if (!userFound) {
            console.log("Usuario no encontrado.")
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }

        userFound.fullName = userToEdit.fullName;
        userFound.birthDate = userToEdit.birthDate;
        userFound.phoneNumber = userToEdit.phoneNumber;
        userFound.occupation = userToEdit.occupation;
        userFound.residence = userToEdit.residence;
        userFound.profilePhoto = userToEdit.profilePhoto;

        const editedUser = await userFound.save();

        const token = Jwt.sign(userFound._id);

        return [editedUser, token]
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
    sendUserCode, 
    verifyUserCode, 
    updateUserPassword
}