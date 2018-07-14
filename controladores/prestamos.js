'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getPrestamos=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM prestamos `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron prestamos`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getPrestamosSinAprobar(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM prestamos WHERE status = '?'  `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron prestamos sin aprobar`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function aprobarRechazarPrestamo(req,res){
    var id_prestamo = req.params.id;
    var status = req.body.status;
    if(status!='A' && status !="R") return status(403).send({message:`El status no es correcto`});
    var fecha_actual = moment().format('LLLL');
    var connection = dbConnection();
    var sql=`UPDATE prestamos set status = '${status}', fecha_aprobacion='${fecha_actual}' where idcredito=${id_prestamo} `;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}   ---> ${sql}`});
        if(!result)  res.status(404).send({message:`No pudo actualizar el status.... ${sql}`});
        if(!err && result){
            res.status(200).send({result:result,sql:sql});
        }
        connection.destroy();
    });
}



module.exports={
    getPrestamos,
    getPrestamosSinAprobar,
    aprobarRechazarPrestamo
}