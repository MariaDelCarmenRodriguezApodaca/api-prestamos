var express = require('express');
var ruta = express.Router();
var contCobros= require('../controladores/cobros');

ruta.get('/get',contCobros.getCobros);

module.exports = ruta;
