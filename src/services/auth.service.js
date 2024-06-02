const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../security/Jwt')
const Role = require('../models/Role')

const createAccount = async (email, fullName, birthDate, phoneNumber, password, roleNames) => {
    try {
        const roles = await Role.find({name: { $in: roleNames}})
        if (roles.length !== roleNames.length) {
            throw {
                status: 400,
                message: "Uno de los roles no existe"
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
                roles: roles.map((role) => role._id)
            })
    
            const savedUser = await newUser.save()
            const user = await User.findById(savedUser._id).populate('roles')
            const token = Jwt.sign(user.email, user.fullName, user.roles.map(role => role.name))
            return [user, token]
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

const signIn = async (email, password) => {
    try {
        const userFound = await User.findOne({email: email}).populate('roles')
        if (!userFound) {
            throw {
                status: 401,
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

        const token = Jwt.sign(userFound.email, userFound.fullName, userFound.roles.map(role => role.name))
        return [userFound, token]
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
    createAccount, 
    signIn
}