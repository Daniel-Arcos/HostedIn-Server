const app = require('./app')
const bodyParser = require('body-parser')

require('./database')
const v1Router = require("./v1/routes")
const morgan = require('morgan')

const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use("/api/v1", v1Router)
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:3000/api/v1`)
})