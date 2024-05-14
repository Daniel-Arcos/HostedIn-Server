const { token } = require('morgan')
const User = require('../models/User')
const PasswordCodes = require('../models/PasswordCode')
const Jwt = require('../Security/Jwt')
const MailSender = require('../utils/MailSender')

const sendEmailCode = async (email) => {
    try{
        const userFound = await User.findOne({email: email})
        if(!userFound){
            console.log("Email no pertenece a nadie.")
            return false
        }
        else{
            console.log("Email encontrado. Existe.")
            const code = generateRandomCode()
            const emailWasSend = MailSender.sendCodeVerificacion(email, code)
            if(emailWasSend){
                const currentDate = new Date()

                const newPasswordCode = new PasswordCodes({
                    email,
                    code, 
                    currentDate
                })
                const savedPassCode = await newPasswordCode.save();
                return true
            }
            else{
                return false
            }            
        }
    }catch(error){
        console.log(error)
    }
}

function generateRandomCode() {
    const min = 10000;
    const max = 99999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {sendEmailCode}