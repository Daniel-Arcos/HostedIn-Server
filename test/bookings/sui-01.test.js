const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Booking API Endpoints', () => {

    //DATOS DE PRUEBA:
    let userHostTest = {
        _id: '',
        email: 'userHostBTest@gmail.com',
        fullName: 'User Booking Test',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'Qwertyui1=',
        roles: ['Host']
    }
    let userGuestTest = {
        _id: '',
        email: 'userGuestBTest@gmail.com',
        fullName: 'User Booking Test',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'Qwertyui1=',
        roles: ['Guest']
    }
    let userGuestTest2 = {
        _id: '',
        email: 'userGuestBTest2@gmail.com',
        fullName: 'User Booking Test',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'Qwertyui1=',
        roles: ['Guest']
    }
    let tokenHost
    let tokenGuest
    let tokenGuest2

    //Registro de usuarios y alojamiento.
    it('Registrar usuario Host', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userHostTest.email,
                fullName: userHostTest.fullName,
                birthDate: userHostTest.birthDate,
                phoneNumber: userHostTest.phoneNumber,
                password: userHostTest.password,
                roles: userHostTest.roles
            })

        expect(res.statusCode).toEqual(201)
        userHostTest._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        tokenHost = tokenBearer.replace("Bearer ", "")
    })

    it('Registrar usuario Guest', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userGuestTest.email,
                fullName: userGuestTest.fullName,
                birthDate: userGuestTest.birthDate,
                phoneNumber: userGuestTest.phoneNumber,
                password: userGuestTest.password,
                roles: userGuestTest.roles
            })

        expect(res.statusCode).toEqual(201)
        userGuestTest._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        tokenGuest = tokenBearer.replace("Bearer ", "")
    })

    it('Registrar usuario Guest2', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userGuestTest2.email,
                fullName: userGuestTest2.fullName,
                birthDate: userGuestTest2.birthDate,
                phoneNumber: userGuestTest2.phoneNumber,
                password: userGuestTest2.password,
                roles: userGuestTest2.roles
            })

        expect(res.statusCode).toEqual(201)
        userGuestTest2._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        tokenGuest2 = tokenBearer.replace("Bearer ", "")
    })

    it('Registrar alojamiento prueba', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .send(
                accommodation
            )
            .set('Authorization', `Bearer ${tokenHost}`)

        console.log(res.body.message)
        expect(res.statusCode).toEqual(201)
        expect(res.body.accommodation.title).toEqual(accommodation.title)
        expect(res.body.accommodation.description).toEqual(accommodation.description)
        accommodation._id = res.body.accommodation._id
    })


    let accommodation = {
        _id: '',
        accommodationServices: ['tv'],
        user: userHostTest,
        title: 'Alojamiento de prueba',
        description: 'Casa de prueba para la API Hosted-IN',
        rules: 'Ninguna',
        accommodationType: 'house',
        nightPrice: 100,
        guestsNumber: 2,
        roomsNumber: 2,
        bedsNumber: 2,
        bathroomsNumber: 2,
        location: {
            latitude: 19.540888,
            longitude:-96.926730,
            address: 'Fei'
        }
      }

    let bookingTest = {
        _id: '',
        accommodation: accommodation,
        beginningDate: '2024-06-26T00:00:00.000+00:00',
        endidngDate: '2024-06-27T00:00:00.000+00:00',
        numberOfGuest: 1,
        totalCost: 200,
        bookingStatus: 'Current',
        guesUser: userGuestTest,
        hostUser: userHostTest
    }


    //POST Booking : exitoso con guest.
    it('Crear Booking exitosamente', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(201)
        expect(res.body.endidngDate).toEqual(bookingTest.endidngDate)
        bookingTest._id = res.body.booking._id
    })


    //POST Booking: reservar el mismo alojamiento con el mismo usuario
    it('eticion crear booking repetido', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //POST Booking: reservar en fechas ocupadas.
    it('Peticion crear booking en fechas ya reservadas', async () => {
        const wrongBooking ={
            ...bookingTest,
            guestUser: userGuestTest2
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //Post Booking : fallo con host
    it('Crear Booking sin exito con host', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(401)
    })

    //POST Booking: fallo con campos vacios
    it('Peticion Crear Booking con campos vacios', async () => {
        const wrongBooking ={
            ...bookingTest,
            beginningDate: ""
        }

        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //POST Booking: fallo con fechas incongruentes
    it('Petiicion Crear Booking con fecha invalidas', async () => {
        const wrongBooking ={
            ...bookingTest,
            beginningDate: "2024-06-26T00:00:00.000+00:00",
            endidngDate: "2024-06-23T00:00:00.000+00:00"
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })


    //POST Booking: usuario inexistente:
    it('CPeticion crear Booking con usuario guest inexistente', async () => {
        const wrongBooking ={
            ...bookingTest,
            guesUser :  { _id: '00a0a0a0a000a000a0a000a0' }
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //POST Booking : fecha de inicio previa a la actual.
    it('Petiicion Crear Booking con fecha inciio invalidas', async () => {
        const wrongBooking ={
            ...bookingTest,
            beginningDate: "2023-01-01T00:00:00.000+00:00"
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //POST Booking: Host y Guest son el mismo.
    it('Petiicion Crear Booking guest y host son el mismo', async () => {
        const wrongBooking ={
            ...bookingTest,
            guesUser: userHostTest
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })


    //Post Booking: Objeto imcompleto
    it('Petiicion Crear Booking con campos imcompletos', async () => {
        const wrongBooking ={
            beginningDate:"",
            guesUser: userHostTest
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                wrongBooking
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })


    //GET booking : exitosamente con Guest
    it('Petiicion Get Booking existente', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/${bookingTest._id}`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
        expect(res.body.booking.beginningDate).toEqual(bookingTest.beginningDate)
    })

      //GET Booking: exitosamente con Host
      it('Petiicion Get Booking con Host', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/${bookingTest._id}`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

    //GET booking : inexistente
    it('Petiicion Get Booking inexistente', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/00a0a0a0a000a000a0a000a0`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //GET Booking: booking sin parametro
    it('Petiicion Get Booking sin parametros', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    

  

})