const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('User API Endpoints PUT', () => {
    let userTest = {
        _id: '',
        email: 'usertest00@gmail.com',
        fullName: 'User Test Jhon Doe',
        birthDate: '2000-10-10T00:00:00.000Z',
        phoneNumber: '2288445533',
        password: 'SecurePassword123#',
        roles: ['Guest', 'Host']
    }

    let token;

    let auxiliarUserTestId;

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

    it('Update a user succesfully', async () => {
        const updatedUserData = {
            email: 'usertest00@gmail.com',
            fullName: 'user Test Name Updated',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '5211445522',
            password: 'n3w#SecurePassword',
            occupation: 'Software Engineer User test',
            residence: 'Xalapa, Veracruz, Mexico',
            roles: ['Guest', 'Host']
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(200)
        expect(res.body.user._id).toEqual(userTest._id)
        expect(res.body.user.email).toEqual(updatedUserData.email)
        expect(res.body.user.fullName).toEqual(updatedUserData.fullName)
        expect(res.body.user.birthDate).toEqual(updatedUserData.birthDate)
        expect(res.body.user.phoneNumber).toEqual(updatedUserData.phoneNumber)
        expect(res.body.user.occupation).toEqual(updatedUserData.occupation)
        expect(res.body.user.residence).toEqual(updatedUserData.residence)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(updatedUserData.roles))
    })    

    it('Update a user with empty id', async () => {
        const res = await request(app)
        .put(`/api/v1/users/`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(res.statusCode).toEqual(404)
    })

    if('Update user with inexistent id', async () => {
        const nonExistentId = '333fbf555a11f11aabf45181';

        const res = await request(app)
        .put(`api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("Usuario no encontrado");
    })

    it('Update a user with null id', async () => {
        const res = await request(app)
            .put(`/api/v1/users/null`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'newemail@gmail.com',
                fullName: 'eeeeeeeee',
                birthDate: '2000-10-22',
                phoneNumber: '2255446699',
                password: 'PassawordSec#12',
                occupation: '',
                residence: ''
            })

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
        expect(res.body.email).toEqual(undefined)
    })

    it('Update a user with invalid id', async () => {
        const invalidId = '12345';

        const res = await request(app)
            .put(`/api/v1/users/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'newemail@gmail.com',
                fullName: 'eeeeeeeee',
                birthDate: '2000-10-22',
                phoneNumber: '2255446699',
                password: 'PassawordSec#12',
                occupation: '',
                residence: ''
            })

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
        expect(res.body.email).toEqual(undefined)
    })

    it('Update a user without some fields', async () => {
        const updatedUserData = {
            phoneNumber: '',
            password: '',
            occupation: '',
            residence: ''
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update user with no fields', async () => {
        const updatedUserData = { };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with empty fields', async () => {
        const updatedUserData = {
            email: '',
            fullName: '',
            birthDate: '',
            phoneNumber: '',
            password: '',
            occupation: '',
            residence: ''
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with null fields', async () => {
        const updatedUserData = {
            email: null,
            fullName: null,
            birthDate: null,
            phoneNumber: null,
            password: null,
            occupation: null,
            residence: null
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid fields', async () => {
        const updatedUserData = {
            email: 'invalidemail',
            fullName: 'invalidfullName',
            birthDate: 'invalidbirthdate',
            phoneNumber: 'invalidphonenumber',
            password: 'invalidpassword',
            occupation: 'invalidoccupation',
            residence: 'invalidresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid email', async () => {
        const updatedUserData = {
            email: 'invalidemail',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '2288304609',
            password: 'validpasswor#5d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid phone number', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: 'a',
            password: 'validpasswor#5d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid phone number 2', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '2288',
            password: 'validpasswor#5d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid birthdate', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: 'invalidBirthdate',
            phoneNumber: '2244556677',
            password: 'validpasswor#5d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid birthdate format', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: '17/11/2003',
            phoneNumber: '2244556677',
            password: 'validpasswor#5d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Update a user with invalid password', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '2244556677',
            password: 'weakpw',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("Uno de los campos falta, esta vacio o es erroneo en la peticion");
    })

    it('Signup with a new auxiliar user succesfully', async () => {
        const auxiliarUser = {
            email: "emailexistentedit@gmail.com",
            fullName: "auxiliar user update",
            birthDate: "2003-03-12T00:00:00.000Z",
            phoneNumber: "1122334455",
            password: "SecureP4sw0r6#",
            roles: userTest.roles
        }

        const resAux = await request(app)
            .post('/api/v1/auth/signup')
            .send(auxiliarUser)

        auxiliarUserTestId = resAux.body.user._id;

        expect(resAux.statusCode).toEqual(201)
        expect(resAux.body.user.email).toEqual(auxiliarUser.email)
        expect(resAux.body.user.fullName).toEqual(auxiliarUser.fullName)
        expect(resAux.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
    })

    it ('Update a user with existent phone number', async () => {
        const updatedUserData = {
            email: 'validemail@gmail.com',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '1122334455',
            password: 'Strong#P4sw0r6d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El número de teléfono ya está registrado por otro usuario.");
    })

    it ('Update a user with existent email', async () => {
        const updatedUserData = {
            email: 'emailexistentedit@gmail.com',
            fullName: 'validfullName',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '2288910245',
            password: 'Strong#P4sw0r6d',
            occupation: 'validoccupation',
            residence: 'validresidence'
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El correo electrónico ya está registrado por otro usuario.");
    })

    it('Update a user without autentication token', async () => {
        const updatedUserData = {
            email: 'usertest00@gmail.com',
            fullName: 'user Test Name Updated',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '5211445522',
            password: 'n3w#SecurePassword',
            occupation: 'Software Engineer User test',
            residence: 'Xalapa, Veracruz, Mexico',
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Unauthorized");
    })

    it('Update a user with incorrect autentication token', async () => {
        const updatedUserData = {
            email: 'usertest00@gmail.com',
            fullName: 'user Test Name Updated',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '5211445522',
            password: 'n3w#SecurePassword',
            occupation: 'Software Engineer User test',
            residence: 'Xalapa, Veracruz, Mexico',
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}123`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Unauthorized");
    })
    
    it('Update a user with additional fields', async () => {
        const updatedUserData = {
            email: 'usertest00@gmail.com',
            fullName: 'user Test Name Updated',
            birthDate: '1995-03-12T00:00:00.000Z',
            phoneNumber: '5211445522',
            password: 'n3w#SecurePassword',
            occupation: 'Software Engineer User test adf',
            residence: 'Xalapa, Veracruz, Mexico',
            nationality: "Mexican",
            Salary: 80000,
            hobby: "Soccer"
        };

        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        expect(res.statusCode).toEqual(200)
    })

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        const resAuxiliarUser = await request(app)
            .delete(`/api/v1/users/${auxiliarUserTestId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
        expect(resAuxiliarUser.statusCode).toEqual(200)
    })
})