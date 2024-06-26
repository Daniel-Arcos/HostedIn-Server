const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../security/Jwt')
const Accommodation = require('../models/Accommodation')
const Booking = require('../models/Booking')
const BookingStatus = require('../models/BookingStatus')
const Review = require('../models/Review');
const Cancellation = require('../models/Cancellation')
const PasswordCodes = require('../models/PasswordCode')
const RecoverPassUtils = require('../utils/RecoverPasswordUtils')
const MailSender = require('../utils/MailSender')
const ObjectIdValidator = require('../utils/ObjectIdValidator')

const ID_MONGO_DB_SIZE = 24;

const getUser = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE
            || !ObjectIdValidator.isValidObjectId(userId)) {
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
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
    }
}

const editAccount = async (userId, userToEdit) => {
    try {
        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE
            || !ObjectIdValidator.isValidObjectId(userId)) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        if (userToEdit.phoneNumber) {
            const existingUser = await User.findOne({ phoneNumber: userToEdit.phoneNumber });
            if (existingUser && existingUser._id.toString() !== userId) {
                throw {
                    status: 400,
                    message: "El número de teléfono ya está registrado por otro usuario."
                };
            }
        }

        if (userToEdit.email) {
            const existingUserWithEmail = await User.findOne({ email: userToEdit.email });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
                throw {
                    status: 400,
                    message: "El correo electrónico ya está registrado por otro usuario."
                };
            }
        }

        if (userToEdit.password !== null && userToEdit.password && userToEdit.password.trim() !== ''){
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
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
    }
}

const deleteAccount = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE
            || !ObjectIdValidator.isValidObjectId(userId)) {
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

        const userAccommodations = await Accommodation.find({ user: userId });

        if (userAccommodations && userAccommodations.length > 0) {
            for (const accommodation of userAccommodations) {
                let hasBookings = await Booking.findOne({accommodation: accommodation._id, bookingStatus: BookingStatus.CURRENT});

                if (hasBookings) {
                    throw {
                        status: 400,
                        message: "No puedes eliminar tu cuenta por reservaciones pendientes"
                    };
                }
            }
        }

        const hasGuestBookings = await Booking.findOne({guestUser: userId, bookingStatus: BookingStatus.CURRENT});

        if (hasGuestBookings) {
            throw {
                status: 400,
                message: "No puedes eliminar tu cuenta por reservaciones activas"
            };
        }

        const accommodationIds = userAccommodations.map(acc => acc._id);
        const bookings = await Booking.find({ accommodation: { $in: accommodationIds } });
        const bookingsId = bookings.map(book => book._id);

        await Accommodation.deleteMany({ user: userId });
        await Review.deleteMany({ accommodation: { $in: accommodationIds } });
        await Cancellation.deleteMany({ booking: { $in: bookingsId } });
        await Cancellation.deleteMany({ cancellator: { $in: userId } });
        await Booking.deleteMany({ accommodation: { $in: accommodationIds } });
        await Booking.deleteMany({ guestUser: userId });

        const deletedUser = await User.deleteOne({ _id: userId });

        if (deletedUser.deletedCount === 0) {
            throw {
                status: 500,
                message: "Error al eliminar el usuario. Inténtelo de nuevo más tarde."
            };
        }

        return deletedUser;
    } catch (error) {
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
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
                        status: 202,
                        message: "Existe un codigo de recuperacion vigente."
                    }
                }               
            }   
            else{                
                await sendEmail(email)
            }                    
        }
    } catch (error){
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
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
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
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
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
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
        if (error.status) {
            throw {
                status: error.status,
                message: error.message
            }
        }
        throw error;
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