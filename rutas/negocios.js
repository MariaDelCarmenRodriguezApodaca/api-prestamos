const express=require('express');
const ruta = express.Router();
const contNegocios=require('../controladores/negocios');

ruta.get('/get', contNegocios.getNegocios);
ruta.get('/get/:id', contNegocios.getNegocio);


module.exports=ruta;