var express = require('express');
var ruta = express.Router();
var contClientes = require('../controladores/clientes');

// Para guardar momentaneamente las imagenes usaremos connect-multiparty
var multipart = require('connect-multiparty');
// Le asigamos el directorio donde estan las imagenes momentaneamente
var md_upload = multipart({ uploadDir:'./uploads' }); 

ruta.get('/get', contClientes.getClientes);
ruta.get('/get/:id', contClientes.getCliente);
ruta.post('/nuevo', contClientes.addCliente);
ruta.put('/update/:id', contClientes.updateCliente);
ruta.put('/uploadImageIne/:id', md_upload, contClientes.uploadImageIne); //le ponemos de middleware el md_upload
ruta.put('/uploadImageDireccion/:id', md_upload, contClientes.uploadImageDireccion); //le ponemos de middleware el md_upload

module.exports= ruta;
