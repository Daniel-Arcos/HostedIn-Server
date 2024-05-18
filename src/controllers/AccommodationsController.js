const { token } = require('morgan')
const AccommodationService = require('../services/AccommodationService')
const { validationResult } = require('express-validator')

const createAccommodation = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: 'title', 'description', 'accommodationType', 'nightPrice', 'guestsNumber', 'roomsNumber', 'bedsNumber', 'bathroomsNumber', 'location'"
            }); 
        }

        const { title, description, rules, accommodationType, nightPrice, guestsNumber, roomsNumber, bedsNumber, bathroomsNumber, location } = req.body

        const newAccommodation = req.body;

        result = await AccommodationService.createAccommodation(newAccommodation);

        //TODO: Token
        //res.header('Authorization', `Bearer ${result[1]}`);
        res.status(201).send({
            message: "Alojamiento creado con éxito",
            user: result[0]
        })
    } catch (error) {
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    createAccommodation
}