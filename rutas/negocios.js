const express=require('express');
const ruta = express.Router();
const contNegocios=require('../controladores/negocios');
const multiparty =require('connect-multiparty');
var md_upload = multiparty({ uploadDir:'./uploads' }); 

ruta.get('/get', contNegocios.getNegocios);
ruta.get('/get/:id', contNegocios.getNegocio);
ruta.post('/nuevo', contNegocios.addNegocio);
ruta.get('/get_detalles', contNegocios.getDetalleNegocio);
ruta.post('/uploadImageNegocio/:id', md_upload, contNegocios.uploadImageNegocio);
ruta.put('/updateImageNegocio/:id', md_upload, contNegocios.updateImageNegocio);
ruta.get('/get_fotos',contNegocios.getFotos);

module.exports=ruta;