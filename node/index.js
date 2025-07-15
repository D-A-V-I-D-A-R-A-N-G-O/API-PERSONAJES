const express = require('express');
const bodyParser = require('body-parser');
const rutaPersonajes = require("./routes/personajes.js");
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const myApp = express();
const port = 443; // Puerto estándar HTTPS

// Archivos del certificado
const opcionesSSL = {
    key: fs.readFileSync(path.join(__dirname, 'cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/cert.pem'))
};

// Middlewares
myApp.use(cors());
myApp.use('/API/img/', express.static(path.join(__dirname, './img/')));
myApp.use(bodyParser.json());

// Rutas
myApp.use('/API/personajes/', rutaPersonajes);

// Ruta no encontrada
myApp.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada ❌" });
});

// Crear servidor HTTPS
https.createServer(opcionesSSL, myApp).listen(port, () => {
    console.log('✅ La API HTTPS está corriendo en https://localhost');
});
