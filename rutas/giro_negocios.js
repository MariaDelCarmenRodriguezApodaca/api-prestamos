var express = require('express');
var ruta = express.Router();
var contGiroNegocios = require('../controladores/giro_negocios');

ruta.get('/get',contGiroNegocios.getNegocios);
ruta.get('/get/:id',contGiroNegocios.getNegocio);
ruta.post('/nuevo',contGiroNegocios.nuevoGiro);
ruta.put('/update/:id',contGiroNegocios.actualizarGiro);
module.exports= ruta;
