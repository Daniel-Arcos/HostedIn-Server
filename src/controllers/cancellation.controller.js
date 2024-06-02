const CancellationService = require('../services/cancellation.service')
const { validationResult } = require('express-validator')

const createCancellation = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Hay un error en la peticion"
            })
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
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

module.exports = {
    createCancellation
}