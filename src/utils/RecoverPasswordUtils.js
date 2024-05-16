const MailSender = require('../utils/MailSender')
const PasswordCodes = require('../models/PasswordCode')

async function sendEmail(email, codeRegistry){
    const code = generateRandomCode()
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

function generateRandomCode() {
    const min = 10000;
    const max = 99999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function is10MinutesAgo(inssuanceDate){
    const nowDate = new Date();
    const diffInMilliseconds = nowDate - inssuanceDate;
    const diffInMinutes = diffInMilliseconds / (1000 * 60); 
    return diffInMinutes >= 10    
}

module.exports = {generateRandomCode, sendEmail, is10MinutesAgo}