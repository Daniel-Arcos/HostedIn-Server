const app = require('./app')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')
require('./libs/initialSetup')
require('./database')
const v1Router = require("./v1/routes")
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const morgan = require('morgan')

const PORT = process.env.SERVER_PORT || 3000

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'))

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("/api/v1", v1Router)
server = app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Server listening on port:${PORT}/api/v1`)
})

module.exports = server;