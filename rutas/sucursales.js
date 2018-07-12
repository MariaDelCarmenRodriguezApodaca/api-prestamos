'use strict'
const express = require('express');
const ruta = express.Router();
const contSucursales = require('../controladores/sucursales');

ruta.get('/get', contSucursales.getSucursales);
ruta.get('/get/:id',contSucursales.getSucursal);
ruta.post('/nueva',contSucursales.nuevaSucursal);
ruta.put('/update/:id',contSucursales.updateSucursal);
ruta.delete('/eliminar/:id',contSucursales.eliminarSucursal);

module.exports=ruta;