const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../Security/Jwt')
const Role = require('../models/Role')

const createAccount = async (email, fullName, birthDate, phoneNumber, password, roleName) => {
    try {

        const role = Role.findOne({name: roleName})
        if (!role) {
            throw {
                status: 400,
                message: "El rol especificado no existe"
            }
        }

        const userWithEmailFound = await User.findOne({email: email})
        const userWithPhoneNumberFound = await User.findOne({phoneNumber: phoneNumber})
        if (userWithEmailFound || userWithPhoneNumberFound) {
            throw {
                status: 400,
                message: "El correo electrónico o número de telefono ya se encuentra registrado."
            }
        } else {            
            const newUser = new User({
                email,
                fullName,
                birthDate,
                phoneNumber,
                password: await User.encryptPassword(password),
                role: role._id
            })
    
            const savedUser = await newUser.save();
            const token = Jwt.sign(savedUser._id)
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