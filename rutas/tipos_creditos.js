var express = require('express');
var ruta = express.Router();
var contTipoCredito = require('../controladores/tipos_creditos');

ruta.get('/get',contTipoCredito.getTipos);
ruta.get('/get/:id',contTipoCredito.getTipo);
ruta.post('/nuevo',contTipoCredito.nuevoTipo);
ruta.put('/update/:id',contTipoCredito.updateTipo);

module.exports= ruta;
