'use strict';


const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const NodeHog = require('nodehog');

const oas3Tools = require('oas3-tools');
const serverPort = parseInt(process.env.SERVER_PORT) || 4201;
// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers'),
        swaggerUi: path.join(__dirname, '/swagger.json'),
        useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const openApiApp = expressAppConfig.getApp();

const app = express();

// Add headers
app.use(/.*/, cors());

// global error handler
function errorHandler(err, req, res, next, statusCode) {
    console.error(err);
    // debug(err);
    if (res.headersSent) {
        return next(err);
    } else {
        res.status(statusCode || 500).json(projectConfig.genericErrorResponse(statusCode || 500, err.message || err || "something blew up and the err object was undefined"));
    }
}

app.use(errorHandler);

app.get('/', (res, req) => {
    console.log("Bem vindo!");
    req.json({"grettings": "Bem vindo!"});
})

app.get('/stress/:elemento/tempostress/:tempoStress/tempofolga/:tempoFolga/ciclos/:ciclos', (req, res) => {
    const elemento = req.params.elemento;
    const tempoStress = req.params.tempoStress * 1000;
    const tempoFolga = req.params.tempoFolga * 1000;
    const ciclos = req.params.ciclos;
    stressGET(req, res, elemento, tempoStress, tempoFolga, ciclos);
});

for (let i = 2; i < openApiApp._router.stack.length; i++) {
    app._router.stack.push(openApiApp._router.stack[i])
}

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

const db = require('./db/mongo');
