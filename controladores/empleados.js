'use strict'
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

let getEmpleados=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM empleados `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
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
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let nuevoEmpleado=(req,res)=>{
    var data = req.body;
    var fecha_alta = moment().format('LLLL');
    if(!data.nombres || !data.app_pat || !data.app_mat || !data.callenum || !data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.negocio || !data.telefono  || !data.usuario || !data.password || !data.status ) return res.status(403).send({message:`ERROR  no se enviaron todos los datos`});
    var sql = `INSERT INTO empleados VALUES(NULL,'${data.nombres}','${data.app_pat}','${data.app_mat}','${data.callenum}', '${data.colonia}','${data.estado}','${data.municipio}', '${data.poblacion}','${data.telefono}','${data.nss}', '${fecha_alta}','${data.negocio}', '${data.sucursal}','${data.usuario}', '${data.password}','Activo', '${data.puesto}','${data.derecho_esp}')`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`Empleado guardada`});
        }
        connection.destroy();
    });
} 

let updateEmpleado = (req,res)=>{
    var idEmpleado = req.params.id;
    var data = req.body;
    if(!data.nombres || !data.app_pat || !data.app_mat || !data.callenum || !data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.telefono  || !data.usuario || !data.password ) return res.status(403).send({message:`ERROR no se enviaron todos los campos`});
    var sql = `UPDATE empleados SET nombres='${data.nombres}', app_pat='${data.app_pat}', app_mat='${data.app_mat}', callenum='${data.callenum}', colonia='${data.colonia}', estado='${data.estado}', municipio='${data.municipio}',poblacion='${data.poblacion}',telefono='${data.telefono}',nss='${data.nss}',negocio='${data.negocio}',sucursal='${data.sucursal}',usuario='${data.usuario}',password='${data.password}',status='${data.status}',puesto='${data.puesto}',derecho_esp='${data.derecho_esp}'WHERE idempleado=${idEmpleado}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err){
            res.status(200).send({result:`Empleado modificada con exito`});
        }
        connection.destroy();
    });
}

let login =(req,res)=>{
    var data = req.body;
    if(!data.usuario || !data.password)return res.status(403).send({message:`ERROR faltaron datos`})
    var sql = `SELECT * FROM empleados WHERE usuario = '${data.usuario}' && password='${data.password}' `;
    var connection = dbConnection();
    connection.query(sql,(err,result,fields)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err){
            if(result) res.status(200).send({result:result});
        }
        connection.destroy();
    });
}


function empleadoDetalle(req,res){
    var sql=`
    SELECT 
    /*Datos del empleado*/
    empleados.idempleado as empleado_idempleado,
    empleados.nombres as empleado_nombres,
    empleados.app_pat as empleado_app_pat,
    empleados.app_mat as empleado_app_mat,
    empleados.callenum as empleado_callenum,
    empleados.colonia as empleado_colonia,
    empleados.estado as empleado_estado,
    empleados.municipio as empleado_municipio,
    empleados.poblacion as empleado_poblacion,
    empleados.telefono as empleado_telefono,
    empleados.nss as empleado_nss,
    empleados.fecha_alta as empleado_fecha_alta,
    empleados.usuario as empleado_usuario,
    empleados.password as empleado_password,
    empleados.status as empleado_status,
    empleados.puesto as empleado_puesto,
    empleados.derecho_esp as empleado_derecho_esp,
    /*info de la sucursal */
    sucursales.idsucursal as sucursal_idsucursal,
    sucursales.nombre as sucursal_nombre
    FROM empleados
    INNER JOIN sucursales ON empleados.sucursal = sucursales.idsucursal
    WHERE empleados.puesto != 'Administrador'
    `;
    var connection = dbConnection()
    connection.query(sql,(err, result)=>{
        if(!err){
            res.status(200).send({result});
        }else res.status(500).send({message:`Error en la base de datos: ${err}`});
        connection.destroy();
    })
}

module.exports={
    getEmpleados,
    getempleado,
    nuevoEmpleado,
    updateEmpleado,
    empleadoDetalle,
    login
}