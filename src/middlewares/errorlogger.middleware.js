const fs = require('fs');
const path = require('path');

const errorLogger = (err, req, res, next) => {
    const today = new Date();
    const date = today.toISOString().split('T')[0]; 
    const logDirectory = path.join(__dirname, 'logs');
    const logFile = path.join(logDirectory, `${date}.log`);

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    const logMessage = `[${new Date().toISOString()}] ${err.message}\n${err.stack}\n\n`;

    fs.appendFile(logFile, logMessage, (writeError) => {
        if (writeError) {
            console.error('No se pudo escribir en el archivo de log:', writeError);
        }
    });

    console.log('Error encontrado:', err.message);
    next(err);
};

module.exports = errorLogger;
