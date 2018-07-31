'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

let getSucursales = (req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM sucursales `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
let getSucursal = (req,res)=>{
    var idSucursal= req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM sucursales WHERE idsucursal = ${idSucursal} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
let nuevaSucursal= (req,res)=>{
    var data = req.body;
    if(!data.nombre ||  !data.callenum || !data.colonia || !data.poblacion || !data.municipio || !data.estado  || !data.hora_inicio || !data.hora_fin || !data.telefono || !data.encargado  ) return res.status(403).send({message:`Faltaron datos en la peticion`}); 
    var sql=`INSERT INTO sucursales VALUES (null, '${data.nombre}','${data.callenum}','${data.colonia}','${data.poblacion}','${data.municipio}','${data.estado}','${data.hora_inicio}','${data.hora_fin}','${data.encargado}','${data.telefono}')`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
       if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    });
}

let updateSucursal = (req, res )=>{
    var data = req.body;
    if(!data.nombre ||  !data.callenum || !data.colonia || !data.poblacion || !data.municipio || !data.estado ||  !data.hora_inicio || !data.hora_fin || !data.telefono  ) return res.status(403).send({message:`Faltaron datos en la peticion`}); 
    var sql=`UPDATE sucursales set nombre='${data.nombre}', callenum = '${data.callenum}', colonia='${data.colonia}', poblacion='${data.poblacion}', municipio='${data.municipio}',estado='${data.estado}',hora_inicio ='${data.hora_inicio}',hora_fin='${data.hora_fin}',telefono='${data.telefono}',encargado='${data.encargado}' WHERE idsucursal=${req.params.id}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err ){
            res.status(200).send({result:result});
        }
        connection.destroy();
    });
}

let eliminarSucursal=(req,res)=>{
    var idSucursal = req.params.id;
    var sql = `DELETE FROM sucursales  WHERE idsucursal = ${idSucursal}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    });
}


module.exports={
    getSucursales,
    getSucursal,
    nuevaSucursal,
    updateSucursal,
    eliminarSucursal
}