const express=require('express');
const ruta = express.Router();
const contNegocios=require('../controladores/negocios');

ruta.get('/get', contNegocios.getNegocios);
ruta.get('/get/:id', contNegocios.getNegocio);
ruta.get('/get_xcliente/:id', contNegocios.getNegocioXCliente);
ruta.post('/nuevo',contNegocios.addNegocio);
ruta.put('/update/:id',contNegocios.updateNegocio);


module.exports=ruta;