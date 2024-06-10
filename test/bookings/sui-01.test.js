const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Bookings Endpoints: Registry Bookings Cases', () => {
    let userHostTest = {
        _id: '',
        email: 'userhost@gmail.com',
        fullName: 'User Test Number One',
        birthDate: '2000-12-10',
        phoneNumber: '2345678901',
        password: 'P4SSw0RD#123',
        roles: ['Host']
    }
    let userGuestTest = {
        _id: '',
        email: 'userguestdos@gmail.com',
        fullName: 'User Test Number two',
        birthDate: '2000-12-10',
        phoneNumber: '0987654321',
        password: 'P4SSw0RD#123',
        roles: ['Guest']
    }
    let otherUserTest = {
        _id: '',
        email: 'userguesttres@gmail.com',
        fullName: 'User Test Number three',
        birthDate: '2000-12-10',
        phoneNumber: '0987654331',
        password: 'P4SSw0RD#123',
        roles: ['Guest']
    }
    let tokenHost;
    let tokenGuest;    
    let tokenGuest2;
    
    

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
        expect(res.body.user.email).toEqual(userHostTest.email)
        expect(res.body.user.fullName).toEqual(userHostTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userHostTest.roles))
        userHostTest._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        tokenHost = tokenBearer.replace("Bearer ", "")
    })


    it('Registry Guest one', async () => {
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
        expect(res.body.user.email).toEqual(userGuestTest.email)
        expect(res.body.user.fullName).toEqual(userGuestTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userGuestTest.roles))
        userGuestTest._id =  res.body.user._id
        let tokenBearer = res.headers.authorization
        tokenGuest = tokenBearer.replace("Bearer ", "")
    })    
    
  
    it('Registry Guest two', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: otherUserTest.email,
                fullName: otherUserTest.fullName,
                birthDate: otherUserTest.birthDate,
                phoneNumber: otherUserTest.phoneNumber,
                password: otherUserTest.password,
                roles: otherUserTest.roles
            })

        expect(res.statusCode).toEqual(201)
        expect(res.body.user.email).toEqual(otherUserTest.email)
        expect(res.body.user.fullName).toEqual(otherUserTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(otherUserTest.roles))
        otherUserTest._id = res.body.user._id
        let tokenBearer =  res.headers.authorization
        tokenGuest2 = tokenBearer.replace("Bearer ", "")
       
    })

//DATOS ALOJAMIENTO
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

    it('Registry accommodation', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .send(
                accommodation
            )
            .set('Authorization', `Bearer ${tokenHost}`)

        expect(res.statusCode).toEqual(201)
        expect(res.body.accommodation.title).toEqual(accommodation.title)
        expect(res.body.accommodation.description).toEqual(accommodation.description)
        accommodation._id = res.body.accommodation._id
    })

    let bookingTest = {
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


    //POST Booking : exitoso con guest.
    it('POST: create booking succ', async () => {
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
    it('POST: Create repeated booking', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })


   


    //POST Booking: reservar en fechas ocupadas.
    it('POST: Create booking with already reserved dates', async () => {
        const wrongBooking ={
            ...bookingTest,
            guestUser: otherUserTest
        }
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(400)
    })
    

    //Post Booking : fallo con host
    it('POST: Create Booking with host', async () => {
        const res = await request(app)
            .post('/api/v1/bookings').send(
                bookingTest
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(401)
    })

    //POST Booking: fallo con campos vacios
    it('POST: create booking with emty field', async () => {
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
    it('POST: Crate booking with incongruent dates', async () => {
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
    it('POST: Create booking with null user', async () => {
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
    it('POST: Create booking with beginningdate before today', async () => {
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
    it('POST: Create booking with host and guest are the same', async () => {
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
    it('POST: Create impcomplete object Booking', async () => {
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
    it('GET: existing Booking succ with guest ', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/${bookingTest._id}`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

      //GET Booking: exitosamente con Host
      it('GET: existing Booking succ with host', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/${bookingTest._id}`).send(                
            ).set('Authorization', `Bearer ${tokenHost}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(200)
    })

    //GET booking : inexistente
    it('GET: get inexistentent booking', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/00a0a0a0a000a000a0a000a0`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(404)
    })

    //GET Booking: booking sin parametro
    it('GET: get booking without ID.', async () => {
        const res = await request(app)
            .get(`/api/v1/bookings/`).send(                
            ).set('Authorization', `Bearer ${tokenGuest}`)
        console.log(res.body.message)
        expect(res.statusCode).toEqual(404)
    })
    

  

})