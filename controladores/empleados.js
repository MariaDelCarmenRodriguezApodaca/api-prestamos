'use strict'
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;
// Poner moment en español 
// moment.locale('es', {
//     months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
//     monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
//     weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
//     weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
//     weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
// });

let getEmpleados=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM empleados `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron empleados`});
        if(!err && result){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getempleado=(req,res)=>{
    var idEmpleado = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM empleados WHERE idempleado = ${idEmpleado} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontro al empleado`});
        if(!err && result){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let nuevoEmpleado=(req,res)=>{
    var data = req.body;
    var fecha_alta = moment().format('LLLL');
    if(!data.nombres || !data.app_pat || !data.app_mat || !data.callenum || !data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.telefono  || !data.usuario || !data.password || !data.status ) return res.status(403).send({message:`ERROR  no se enviaron todos los datos`});
    var sql = `INSERT INTO empleados VALUES(NULL,'${data.nombres}','${data.app_pat}','${data.app_mat}','${data.callenum}', '${data.colonia}','${data.estado}','${data.municipio}', '${data.poblacion}','${data.telefono}', '${fecha_alta}','${data.negocio}', '${data.sucursal}','${data.usuario}', '${data.password}',1, '${data.puesto}','${data.derecho_esp}')`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!result)  res.status(403).send({message: `Ha ocurrido un ERROR.... ${sql}`});
        if(!err && result){
            res.status(200).send({result:`Empleado guardada`});
        }
        connection.destroy();
    });
} 

let updateEmpleado = (req,res)=>{
    var idEmpleado = req.params.id;
    var data = req.body;
    if(!data.nombres || !data.app_pat || !data.app_mat || !data.callenum || !data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.telefono  || !data.usuario || !data.password ) return res.status(403).send({message:`ERROR no se enviaron todos los campos`});
    var sql = `UPDATE empleados SET nombres='${data.nombres}', app_pat='${data.app_pat}', app_mat='${data.app_mat}', callenum='${data.callenum}', colonia='${data.colonia}', estado='${data.estado}', municipio='${data.municipio}',poblacion='${data.poblacion}',telefono='${data.telefono}',negocio='${data.negocio}',sucursal='${data.sucursal}',usuario='${data.usuario}',password='${data.password}',status='${data.status}',puesto='${data.puesto}',derecho_esp='${data.derecho_esp}'WHERE idempleado=${idEmpleado}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!result) res.status(404).send({message:`ERROR !result`});
        if(!err && result){
            res.status(200).send({result:`Empleado modificada con exito`});
        }
        connection.destroy();
    });
}

let login =(req,res)=>{
    var data = req.body;
    if(!data.usuario || !data.password) res.status(403).send({message:`ERROR faltaron datos`})
    var sql = `SELECT * FROM empleados WHERE usuario = '${data.usuario}' && password='${data.password}' `;
    var connection = dbConnection();
    connection.query(sql,(err,result,fields)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!result) res.status(404).send({message:`ERROR contraseña o usuarios incorrectos`});
        if(!err && result){
            if(result) res.status(200).send({result:result});
        }
        connection.destroy();
    });
}


module.exports={
    getEmpleados,
    getempleado,
    nuevoEmpleado,
    updateEmpleado,
    login
}