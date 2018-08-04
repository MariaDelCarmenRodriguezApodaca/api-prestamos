const express=require('express');
const ruta = express.Router();
const contRutas=require('../controladores/zonas');

ruta.get('/get', contRutas.getZonas);
ruta.get('/get/:id', contRutas.getZona);
ruta.post('/nueva',contRutas.addZona);
ruta.put('/update/:id', contRutas.updateZona);
// ruta.post('/add_zona_cobrador',contRutas.addRutaCobrador);
// ruta.get('/get_zona_cobrador',contRutas.getRutasCobrador);
ruta.get('/get_detalles',contRutas.getZonasDetalles);

module.exports=ruta;