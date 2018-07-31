const express=require('express');
const ruta = express.Router();
const contRutas=require('../controladores/rutas');

ruta.get('/get', contRutas.getRutas);
ruta.get('/get/:id', contRutas.getRuta);
ruta.post('/nueva',contRutas.addRuta);
ruta.put('/update/:id', contRutas.updateRuta);
ruta.post('/add_ruta_cobrador',contRutas.addRutaCobrador);
ruta.get('/get_ruta_cobrador',contRutas.getRutasCobrador);
ruta.get('/get_detalles',contRutas.getRutasDetalles);

module.exports=ruta;