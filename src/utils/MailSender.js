const NodeMailer = require('nodemailer')

function createMailTransporter(){
    const transporter = NodeMailer.createTransport({
        service: "hotmail",
        auth: {
            user: "hostedin@outlook.com",
            pass: "HostedPassword"
        }
    });
    return transporter
}


const sendCodeVerificacion = (email, code) =>{
    const transporter = createMailTransporter()

    const mailOptions = {
        from: '"HostedIn App" <hostedin@outlook.com>',
        to: email,
        subject: "Code verification",
        html: `<p>Hello, enter this code in your HostedIn app</p><p>${code}</p>`
    }

    transporter.sendMail(mailOptions, (error,info)=>{
        if(error){
            console.log(error)
            return false
        }
        else{
            console.log("Code sent")
            return true
        }
    })
}

module.exports = {sendCodeVerificacion}