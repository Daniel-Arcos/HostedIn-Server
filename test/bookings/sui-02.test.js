const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Bookings Endpoint: Recover host bookings of accommodation', () => {

    //DATOS DE PRUEBA:
    let userHostTest = {
        _id: '',
        email: 'userHostCTest@gmail.com',
        fullName: 'User Booking Test',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'Qwertyui1=',
        roles: ['Host']
    }
    let userGuestTest = {
        _id: '',
        email: 'userGuestCTest@gmail.com',
        fullName: 'User Booking Test',
        birthDate: '2000-12-10',
        phoneNumber: '1234567801',
        password: 'Qwertyui1=',
        roles: ['Guest']
    }
    let userGuestTest2 = {
        _id: '',
        email: 'userGuestCTest2@gmail.com',
        fullName: 'User Booking Test TWO',
        birthDate: '2000-12-10',
        phoneNumber: '1234567811',
        password: 'Qwertyui1=',
        roles: ['Guest']
    }
    let tokenHost
    let tokenGuest
    let tokenGuest2

    //Registro de usuarios y alojamiento.
    it('Registry Host', async () => {
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

    it('Registry Guest', async () => {
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

    it('Registy Guest2', async () => {
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

    //Datos de alojamiento
    let accommodation = {
        _id: '',
        accommodationServices: ['tv'],
        user: userHostTest,
        title: 'Alojamiento de prueba C',
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

      let accommodation2 = {
        _id: '',
        accommodationServices: ['tv'],
        user: userHostTest,
        title: 'Alojamiento de prueba D',
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

    it('Registry accommo 1', async () => {
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

    it('Registry accommo 2', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .send(
                accommodation2
            )
            .set('Authorization', `Bearer ${tokenHost}`)

        console.log(res.body.message)
        expect(res.statusCode).toEqual(201)
        expect(res.body.accommodation.title).toEqual(accommodation2.title)
        expect(res.body.accommodation.description).toEqual(accommodation2.description)
        accommodation2._id = res.body.accommodation._id
    })
    
    

    let bookingTest1 = {
        _id: '',
        accommodation: accommodation,
        beginningDate: '2024-12-10',
        endingDate: '2024-12-11',
        numberOfGuests: 1,
        totalCost: 200,
        bookingStatus: 'Current',
        guestUser: userGuestTest,
        hostUser: userHostTest
    }

    let bookingTest2 = {
        _id: '',
        accommodation: accommodation,
        beginningDate: '2024-12-12',
        endingDate: '2024-12-13',
        numberOfGuests: 1,
        totalCost: 200,
        bookingStatus: 'Current',
        guestUser: userGuestTest2,
        hostUser: userHostTest
    }


    //Registrar Bookings
    it('Create Booking 1', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest1
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(201)
        bookingTest1._id = res.body.booking._id
    })

    it('Create Booking 2', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest2
            ).set('Authorization', `Bearer ${tokenGuest2}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(201)
        bookingTest2._id = res.body.booking._id
    })


    ///CASOS DE PRUEBA
    //GET reservaciones de alojamientos.
    it('GET: get host bookings succ', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/${accommodation._id}/bookings`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

    //GET reservaciones de alojamientos.
    it('GET: get bookings wit Invalid accommo ID', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/"00000000000000"/bookings`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })

    //GET reservaciones de alojamientos  Vigentes.
    it('GET: get current bookings', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/${accommodation._id}/bookings?bookingStatus=Current`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

    //GET reservaciones de alojamientos  Vencido y cancelados.
    it('GET: get old bookings', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/${accommodation._id}/bookings?bookingStatus=Overdue`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

    //GET reservaciones de alojamientos  sin reservaciones
    it('GET: get  old bookings of accommo without bookings', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/${accommodation2._id}/bookings?bookingStatus=Overdue`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })


    //GET reservaciones de host ruta incompleta
    it('GET: get host bookings with incomplete path', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/00a0a0a0a000a000a0a000a0`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(404)
    })


    //GET reservaciones de alojamiento sin reservaciones
    it('GET: get bookings of a accommo without bookings ', async () => {
        const res = await request(app)
            .get(`/api/v1/accommodations/${accommodation2._id}`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(404)
    })
 

})