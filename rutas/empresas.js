const express=require('express');
const ruta = express.Router();
const contEmpresas=require('../controladores/empresas');

ruta.get('/get', contEmpresas.getEmpresas);
ruta.get('/get/:id', contEmpresas.getEmpresa);
ruta.post('/nueva',contEmpresas.addEmpresa);

module.exports=ruta;