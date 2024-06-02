const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Review API Endpoints', () => {
    let userTest = {
        _id: '',
        email: 'usertesthost011@gmail.com',
        fullName: 'User Test host Jhon Doe',
        birthDate: '2003-10-10T00:00:00.000Z',
        phoneNumber: '2288222479',
        password: 'SecurePassword123#',
        roles: ['Guest', 'Host']
    }

    let userGuestTest = {
        _id: '',
        email: 'usertestguestreview@gmail.com',
        fullName: 'User Test guest review Jhon Doe',
        birthDate: '2003-10-10T00:00:00.000Z',
        phoneNumber: '2218445237',
        password: 'SecurePassword123#',
        roles: ['Guest', 'Host']
    }

    let token;

    afterAll (async () => {
        app.close()
        moongose.disconnect();
    })

    it('Signup with a new user succesfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userTest.email,
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(201)
        expect(res.body.user.email).toEqual(userTest.email)
        expect(res.body.user.fullName).toEqual(userTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
        userTest._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        token = tokenBearer.replace("Bearer ", "")
    })

    it('Signup with a new guest user succesfully', async () => {
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
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
        userGuestTest._id = res.body.user._id
    })

    let accommodationTest = {
        _id: '',
        title: "Awesome accommodation test",
        description: "This is a test accommodation",
        rules: "No smoking",
        accommodationType: "house",
        nightPrice: 1500,
        guestsNumber: 4,
        roomsNumber: 2,
        bedsNumber: 3,
        bathroomsNumber: 2,
        accommodationServices: ["internet", "parking", "pool"],
        location: {
            type: 'Point',
            coordinates: [-103.349609, 20.659698],
            latitude: 20.659698,
            longitude: -103.349609,
            address: "123 Playa Street, Beach City test"
        },
        user: userTest
    }

    it('Create accommodation succesfully', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .set('Authorization', `Bearer ${token}`)
            .send(accommodationTest)

        expect(res.statusCode).toEqual(201)
        expect(res.body.accommodation.title).toEqual(accommodationTest.title)
        expect(res.body.accommodation.description).toEqual(accommodationTest.description)
        expect(res.body.accommodation.location.address).toEqual(accommodationTest.location.address)
        expect(res.body.accommodation.nightPrice).toEqual(accommodationTest.nightPrice)
        expect(res.body.accommodation.guestsNumber).toEqual(accommodationTest.guestsNumber)
        expect(res.body.accommodation.roomsNumber).toEqual(accommodationTest.roomsNumber)
        accommodationTest._id = res.body.accommodation._id
    })

    it('Save new review successfully', async() => {
        const reviewTest = {
            accommodation: accommodationTest,
            reviewDescription: "Excelent accommodation and great host. test",
            rating: 4.5,
            guestUser: userGuestTest
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(201)
            expect(res.body.review.accommodation).toEqual(accommodationTest._id)
            expect(res.body.review.reviewDescription).toEqual(reviewTest.reviewDescription)
            expect(res.body.review.rating).toEqual(reviewTest.rating)
            expect(res.body.review.guestUser._id).toEqual(reviewTest.guestUser._id)
    })

    it('Save new review without fields', async() => {
        const reviewTest = { }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion")
    })

    it('Save new review null', async() => {
        const reviewTest = null

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
    })

    it('Save new review with wrong rating', async() => {
        const reviewTest = {
            accommodation: accommodationTest,
            reviewDescription: "Excelent accommodation and great host. test",
            rating: "wrong rating",
            guestUser: userGuestTest
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion")
    })

    it('Save new review with wrong description', async() => {
        const reviewTest = {
            accommodation: accommodationTest,
            reviewDescription: null,
            rating: "wrong rating",
            guestUser: userGuestTest
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion")
    })

    it('Save new review with wrong guestUser', async() => {
        const reviewTest = {
            accommodation: accommodationTest,
            reviewDescription: "Excelent accommodation and great host. test",
            rating: "wrong rating",
            guestUser: "hello"
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion")
    })

    it('Save new review with wrong accommodation', async() => {
        const reviewTest = {
            accommodation: "inexistent",
            reviewDescription: "Excelent accommodation and great host. test",
            rating: "wrong rating",
            guestUser: "hello"
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion")
    })

    it('Save existent review', async() => {
        const reviewTest = {
            accommodation: accommodationTest,
            reviewDescription: "Excelent accommodation and great host. test",
            rating: 4.5,
            guestUser: userGuestTest
        }

        const res = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewTest)

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toEqual("Ya tienes una review de este alojamiento")
    })

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        const resGuest = await request(app)
        .delete(`/api/v1/users/${userGuestTest._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
        expect(resGuest.statusCode).toEqual(200)
    })

    it('Delete accommodation succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/accommodations/${accommodationTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
    })
})