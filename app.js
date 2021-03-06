'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const morgan  = require('morgan');
var addHeaders = require('./middlewares/add_headers');
var moment = require('moment');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: "doxrlcgtc",
    api_key: "987472538786775",
    api_secret: "5eeR5ALC0UXmjJ1koaFZ_BOs2b4"
});

// Archivos de rutas
let rutaSucursales = require('./rutas/sucursales');
let rutaEmpleados = require('./rutas/empleados');
let rutaClientes = require('./rutas/clientes');
let rutaNegocios = require('./rutas/negocios');
let rutaGiroNegocios = require('./rutas/giro_negocios');
let rutaEmpresas = require('./rutas/empresas');
let rutasCobros = require('./rutas/cobros');
let rutasPrestamos = require ('./rutas/prestamos');
let rutasTiposCredito = require('./rutas/tipos_creditos')
let rutasEncuesta = require('./rutas/encuestas');
let rutasZonas = require('./rutas/zonas');
let rutasIvestigaciones = require('./rutas/investigaciones');

//Midlewares de librerias:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //para enterder los datos que envian los clientes en formato json
app.use(morgan('dev')); //que utilice morgan en su configuracion de desarrollo
app.use(addHeaders); //Añadimos cabeceras necesarias para angular


//Middlewares de rutas:
app.use('/sucursales',rutaSucursales);
app.use('/empleados',rutaEmpleados);
app.use('/clientes',rutaClientes);
app.use('/negocios',rutaNegocios);
app.use('/giro_negocios',rutaGiroNegocios);
app.use('/empresas',rutaEmpresas);
app.use('/cobros',rutasCobros)
app.use('/prestamos',rutasPrestamos);
app.use('/tipos_creditos',rutasTiposCredito);
app.use('/encuestas',rutasEncuesta);
app.use('/zonas',rutasZonas);
app.use('/investigaciones',rutasIvestigaciones);

//pagina sin ruta//
app.get('/',(req,res)=>{
    res.send({message:'ERROR! No accediste a ninguna opcion prueba con la url http://......../empleados/get'});
});

module.exports = app;
