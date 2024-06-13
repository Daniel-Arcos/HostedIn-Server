const AccommodationService = require('../services/accommodation.service')
const { validationResult } = require('express-validator')

const getAccommodations = async (req, res, next) => {
    try {
        const { lat, long, id } = req.query;
        let result
        if (id) {
            if (lat && long) {
                result = await AccommodationService.getAccommodationsByLocationAndId(lat, long, id)
            } else {
                result = await AccommodationService.getAllAccommodations(id)   
            }
        } else {
            result = await AccommodationService.getAllAccommodations()
        }
        return res.status(200).send({
            message: "Alojamientos recuperados con exito",
            accommodations: result})
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

const createAccommodation = async (req, res, next) => {
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
                coordinates: [location.longitude, location.latitude],
                address: location.address
            },
            user: req.body.user._id
        };

        result = await AccommodationService.createAccommodation(newAccommodation)

        res.status(201).send({
            message: "Alojamiento creado con éxito",
            accommodation: result
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

const updateAccommodation = async (req, res, next) => {
    try {

        const _id = req.params.accommodationId
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uno de los siguientes campos falta o esta vacio en la peticion: 'title', 'description', 'accommodationType', 'nightPrice', 'guestsNumber', 'roomsNumber', 'bedsNumber', 'bathroomsNumber', 'location'"
            }); 
        }

        const { title, description, rules, accommodationType, nightPrice, guestsNumber, roomsNumber, bedsNumber, bathroomsNumber, location } = req.body

        const accommodationUpdated = {
            _id,
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
                coordinates: [location.longitude, location.latitude],
                address: location.address
            },
            user: req.body.user._id
        };
        result = await AccommodationService.updateAccommodation(accommodationUpdated)
        res.status(201).send({
            message: "Alojamiento actualizado con éxito",
            accommodation: result
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


const deleteAccommodation = async (req, res, next) => {
    try {

        const _id = req.params.accommodationId       
        result = await AccommodationService.deleteAccommodation(_id)

        res.status(200).send({
            message: result
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
    createAccommodation,
    getAccommodations,
    updateAccommodation,
    deleteAccommodation
}
