var express = require('express');
var route = express.Router();
var contInvestigaciones = require('../controladores/investigaciones');

route.put('/update/:id',contInvestigaciones.updateInvestigaciones);
route.get('/get',contInvestigaciones.getInvestigaciones);

module.exports = route;