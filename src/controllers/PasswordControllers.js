const RecoverPassService = require('../services/RecoverPassService')

const sendEmailCode = async(req, res) => {
    try {
        const {email} = req.body
        if (email == null) {
            res.status(400).send({ 
                error: "El campo email falta o esta vacio en la peticion"})
        }

        console.log(email)
        result = await RecoverPassService.sendEmailCode(email)
        if(result){
            res.status(200).send({
                message:"Se envio el codgio exitosamente"
            })
        }else{
            res.status(400).send({
                message:"El email es incorrecto"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Algo ocurrio. Lo solucionaremos pronto."
        })
    }
}

module.exports = {sendEmailCode}