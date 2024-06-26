const UserService = require('../services/user.service')
const User = require('../models/User')
const jwt = require('../security/Jwt')
const { validationResult } = require('express-validator')
const Accommodation = require('../models/Accommodation')
const AccommodationService = require('../services/accommodation.service')

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId || userId === null || userId === '') {
            return res.status(400).send({error: "El id del usuario 'userId' viene nulo o vacío"})
        }

        const result = await UserService.getUser(userId);
        return res.status(200).send({
            message: "Cuenta recuperada con éxito",
            user: {
                _id: result._id,
                email: result.email,
                fullName: result.fullName,
                birthDate: result.birthDate,
                phoneNumber: result.phoneNumber,
                password: result.password,
                occupation: result.occupation,
                residence: result.residence,
                profilePhoto: result.profilePhoto,
                roles: result.roles.map(role => role.name),
            }
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const updateUserById = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los campos falta, esta vacio o es erroneo en la peticion"
            }); 
        }

        const userId = req.params.userId;

        if (userId === null) {
            return res.status(400).send({error: "El id del usuario viene nulo"})
        }

        const {email, fullName, birthDate, phoneNumber, occupation, residence, profilePhoto, password} = req.body;

        if (email == null ||
            fullName == null ||
            birthDate == null ||
            phoneNumber == null
        ) {
            return res.status(400).send({ 
                error: "Uno de los siguientes campos falta o esta vacio en la peticion: 'email', 'fullName', 'birthDate', 'phoneNumber'"
            })
        }

        const userToEdit = {
            email,
            fullName,
            birthDate,
            phoneNumber,
            password,
            occupation,
            residence,
            profilePhoto
        }
        
        const result = await UserService.editAccount(userId, userToEdit);

        return res.status(200).send({
            message: "Cuenta actualizada con exito",
            user: {
                _id: result._id,
                email: result.email,
                fullName: result.fullName,
                birthDate: result.birthDate,
                phoneNumber: result.phoneNumber,
                password: result.password,
                occupation: result.occupation,
                residence: result.residence,
                profilePhoto: result.profilePhoto,
                roles: result.roles.map(role => role.name),
            }
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const deleteUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (userId === null) {
            return res.status(400).send({error: "El id del usuario viene nulo"})
        }
        
        const result = await UserService.deleteAccount(userId);

        return res.status(200).send({
            userId: userId,
            message: "Cuenta eliminada con exito"
        })

    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const sendUserEmail = async(req, res, next) => {
    try {
        const {content} = req.body
        if (!content) {
            throw {
                status: 400,
                message: "Falta el campo correo"
            }
        }
        const email = content
        result = await UserService.sendUserCode(email)               
        return res.status(200).send({
            message:"Codigo enviado exitosamente"
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const userCodeVerification = async(req, res, next) => {
    try {
        const { content } = req.body
        if(!content) {
            throw {
                status: 400,
                message: "Falta el campo codigo"
            }
        }
        const code = content
        result = await UserService.verifyUserCode(code)
        res.header('Authorization', `Bearer ${result}`)    
        return res.status(200).send({
            message:"Codigo correcto"
        })      
    }
    catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const updateUserPassword = async(req, res, next) => {
    try {

        const authorization = req.headers.authorization;  
        if (!authorization) {
            throw { status: 401, message: 'Authorization header is missing' };
        }      
        jwt.verifyToken(authorization)  
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw { status : 400,
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: 'email', 'password'"
            }
        }
        
        const {newPassword, email} = req.body 
        
        await UserService.updateUserPassword(newPassword, email)
        return res.status(200).send({
            message:"Contaseña actualizada correctamente"
        })        
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const getHostAccommodationsByUserId = async (req, res, next) => {
    try {
        const userId= req.params.userId
        const {atLeastOneBooking} = req.query
        let accommodations

        if (!userId) {
            throw {
                status: 400,
                message: "UserID no válido"
            }
        }

        if(atLeastOneBooking){
            accommodations = await AccommodationService.getOwnedBookedAccommodations(userId)      
        }else{
            accommodations = await AccommodationService.getAllOwnedAccommodations(userId)
        }

        return res.status(200).send({
            message:"Alojamientos recuperados exitosamente",
            accommodations})
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }   
}

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    sendUserEmail,
    userCodeVerification, 
    updateUserPassword,
    getHostAccommodationsByUserId
}