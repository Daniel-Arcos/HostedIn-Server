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


const sendCodeVerificacion = async (email, code) =>{
    const transporter = createMailTransporter()

    const mailOptions = {
        from: '"HostedIn App" <hostedin@outlook.com>',
        to: email,
        subject: "Code verification",
        html: `<p>Hello, enter this code in your HostedIn app</p><p>${code}</p>`
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Code sent");
        return true;
    } catch (error) {
        throw {
            status: 400,
            message: "Email no enviado"
        }
    }
}

module.exports = {sendCodeVerificacion}