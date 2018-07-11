var express = require('express');
var ruta = express.Router();
var contClientes = require('../controladores/clientes');

ruta.get('/get',contClientes.getClientes);
ruta.get('/get/:id',contClientes.getCliente);

module.exports= ruta;
