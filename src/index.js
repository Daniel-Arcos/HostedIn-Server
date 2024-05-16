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
app.use((err, req, res, next) => {
    const tooLargeError = 'La entidad de la solicitud es demasiado grande.'
    console.error(tooLargeError);
    if (err.type === 'entity.too.large') {
        return res.status(err?.status || 500)
            .send({
                message: tooLargeError || err?.message || err
            })
    }
    next(err);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err?.message || err || 'Error Interno del Servidor',
    });
});
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Server listening on port:${PORT}/api/v1`)
})