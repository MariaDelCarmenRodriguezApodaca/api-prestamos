'use strict'
const express = require('express');
const ruta = express.Router();
const contEncuestas = require('../controladores/encuestas');

ruta.get('/get', contEncuestas.getEncuestas);
ruta.get('/get_pendientes', contEncuestas.getEncuestasPendientes);
ruta.get('/get_terminadas', contEncuestas.getEncuestasTerminadas);
ruta.get('/get/:id',contEncuestas.getEncuesta);
ruta.post('/nueva',contEncuestas.nuevaEncuesta);
ruta.put('/update/:id',contEncuestas.updateEncuesta);
ruta.get('/get_detalles_simples',contEncuestas.getEncuestaDetalleSimple);
ruta.get('/get_detalles_simples_terminadas',contEncuestas.getEncuestaDetalleSimpleTerminada);
ruta.get('/get_detalles_simples_pendientes',contEncuestas.getEncuestaDetalleSimplePendiente);

module.exports=ruta;