var express = require('express');
var ruta = express.Router();
var contClientes = require('../controladores/clientes');

// imports para imagens
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir:'./uploads/clientes' });
// ---------------------


ruta.get('/get',contClientes.getClientes);
ruta.get('/get/:id',contClientes.getCliente);

ruta.post('/imagen_direccion/:id',md_upload,contClientes.imagenDireccion);
ruta.post('/imagen_ine/:id',md_upload,contClientes.imagenIne);

ruta.get('/ver_imagen/:image_file',contClientes.regresarImg);
ruta.post('/ver_imagen/ruta/',contClientes.regresarImgRuta);

module.exports= ruta;
