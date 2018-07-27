'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;



let getNegocios=(req,res)=>{
	var connection = dbConnection();
	connection.query(`SELECT * FROM giros`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		if(!err){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}



let getNegocio=(req,res)=>{
	var data = req.params;
	var idNegocio = data.id;
	var connection=dbConnection();
	connection.query(`SELECT * FROM giros WHERE idgiro= '${idNegocio}'`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta ${err} ... sql = ${sql}`});
		if(!err){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}

let nuevoGiro = (req,res)=>{
	var data = req.body;
	console.log(data);
	var sql = `INSERT INTO giros VALUES(NULL,'${data.descripcion}')`;
	var connection = dbConnection();
	connection.query(sql,(err,result)=>{
		if(err) res.status(500).send({message:`ERROR No se guardo  la consulta ${sql}`});
		if(!err){
			console.log(sql);
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}


function actualizarGiro(req,res){
	var idgiro = req.params.id;
    var data = req.body;
    if(!data.descripcion ) return res.status(403).send({message:`ERROR no se enviaron todos los campos`});
    var sql = `UPDATE giros SET descripcion='${data.descripcion}'WHERE idgiro=${idgiro}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err){
            res.status(200).send({result:`giro modificada con exito`});
        }
        connection.destroy();
    });
}

function eliminarGiro(req,res){

}

let prueba = (req,body) =>{
	res.status(200).send({message:'esto es una prueba'});
}


module.exports={
	getNegocios,
	getNegocio,
	nuevoGiro,
	actualizarGiro,
	eliminarGiro,
	prueba
}