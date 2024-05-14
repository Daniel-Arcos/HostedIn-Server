const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../Security/Jwt')

const createAccount = async (email, fullName, birthDate, phoneNumber, password) => {
    try {

        const userFound = await User.findOne({email: email})

        if (userFound) {
            console.log("Usuario encontrado. Existe.")
            return ["", ""]
        } else {           
            console.log("Usuario no encontrado.")



            const partesFecha = birthDate.split('/');
            const fechaNacimiento = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
            


            const newUser = new User({
                email,
                fullName,
                fechaNacimiento,
                phoneNumber,
                password: await User.encryptPassword(password)
              })
    
            const savedUser = await newUser.save();
            const token = Jwt.sign(savedUser._id)
            console.log(token)
            return [savedUser, token]
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createAccount }