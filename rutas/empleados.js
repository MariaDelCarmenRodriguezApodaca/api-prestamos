'use strict'
const express = require('express');
const ruta = express.Router();
const contEmpleados = require('../controladores/empleados');

ruta.get('/get',contEmpleados.getEmpleados);
ruta.get('/get/:id',contEmpleados.getempleado);
ruta.post('/nuevo',contEmpleados.nuevoEmpleado);
ruta.put('/update/:id',contEmpleados.updateEmpleado);
ruta.post('/login',contEmpleados.login);

module.exports=ruta;