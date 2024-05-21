const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'Hosted-In API',
        description: 'Hosted-In API built with Node.js'
    },
    host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ["./src/index.js"]

swaggerAutogen(outputFile, routes, doc)