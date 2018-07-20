'use strict'
const express = require('express');
const ruta = express.Router();
const contEncuestas = require('../controladores/encuestas');

ruta.get('/get', contEncuestas.getEncuestas);
ruta.get('/get_pendientes', contEncuestas.getEncuestasPendientes);
ruta.get('/get_terminadas', contEncuestas.getEncuestasTerminadas);
ruta.get('/get/:id',contEncuestas.getEncuesta);
ruta.post('/nueva',contEncuestas.nuevaEncuesta);

module.exports=ruta;