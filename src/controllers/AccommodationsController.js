const { token } = require('morgan')
const AccommodationService = require('../services/AccommodationService')
const { validationResult } = require('express-validator')

const getAccommodations = async (req, res) => {
    try {
        const { lat, long } = req.query;
        let result
        if (lat && long) {
            result = await AccommodationService.getAccommodationsByLocation(lat, long)
        } else {
            result = await AccommodationService.getAllAccommodations()
        }
        return res.status(200).send({
            message: "Alojamientos recuperados con exito",
            accommodations: result})
    } catch (error) {
        return res
        .status(error?.status || 500)
        .send({message: error?.message || error});
    }
}

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

        const newAccommodation = {
            title,
            description,
            rules,
            accommodationType,
            nightPrice,
            guestsNumber,
            roomsNumber,
            bedsNumber,
            bathroomsNumber,
            accommodationServices: req.body.accommodationServices || [],
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude]
            },
            userId: req.body.userId
        };

        result = await AccommodationService.createAccommodation(newAccommodation);

        //TODO: Token
        //res.header('Authorization', `Bearer ${result[1]}`);
        res.status(201).send({
            message: "Alojamiento creado con éxito",
            user: result[0]
        })
    } catch (error) {
        console.log(error)
        return res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    createAccommodation,
    getAccommodations
}
