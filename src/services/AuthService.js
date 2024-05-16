const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../Security/Jwt')

const createAccount = async (email, fullName, birthDate, phoneNumber, password) => {
    try {

        const userWithEmailFound = await User.findOne({email: email})
        const userWithPhoneNumberFound = await User.findOne({phoneNumber: phoneNumber})
        if (userWithEmailFound || userWithPhoneNumberFound) {
            throw {
                status: 400,
                message: "El correo electrónico o número de telefono ya se encuentra registrado."
            }
        } else {            
            // const partesFecha = birth.split('/');
            // const birthDate = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
            const newUser = new User({
                email,
                fullName,
                birthDate,
                phoneNumber,
                password: await User.encryptPassword(password)
            })
    
            const savedUser = await newUser.save();
            const token = Jwt.sign(savedUser._id)
            console.log(token)
            return [savedUser, token]
        }
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const signIn = async (email, password) => {
    try {
        const userFound = await User.findOne({email: email})
        if (!userFound) {
            throw {
                status: 400,
                message: "Usuario no encontrado."
            }
        }

        const matchPassword = await User.comparePassword(
            password,
            userFound.password
        )

        if (!matchPassword) {
            throw {
                status: 401,
                message: "Contraseña incorrecta"
            }
        }

        const token = Jwt.sign(userFound._id)
        return [userFound, token]
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}


module.exports = { 
    createAccount, 
    signIn
}