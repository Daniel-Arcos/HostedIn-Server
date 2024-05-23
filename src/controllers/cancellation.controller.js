const CancellationService = require('../services/cancellation.service')
const { validationResult } = require('express-validator')

const createCancellation = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            throw { status : 400,
                errors: errors.array(),
                message: "Hay un error en la peticion"
            }
        }

        const { cancellationDate, reason, cancellator, booking } = req.body
        const cancellation = {
            cancellationDate,
            reason,
            cancellator,
            booking
        }
        const createdCancellation = await CancellationService.createCancellation(cancellation)
        res.status(201).send({
            message: "Reservacion cancelada exitosamente",
            cancellation: createdCancellation
        })
    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    createCancellation
}