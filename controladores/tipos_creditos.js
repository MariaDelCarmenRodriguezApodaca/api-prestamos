'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;



let getTipos=(req,res)=>{
	var connection = dbConnection();
	connection.query(`SELECT * FROM creditos`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		if(!err){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}



let getTipo=(req,res)=>{
	var data = req.params;
	var idcredito = data.id;
	var connection=dbConnection();
	connection.query(`SELECT * FROM creditos WHERE idcredito= '${idcredito}'`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta ${err} ... sql = ${sql}`});
		if(!err){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}

let nuevoTipo = (req,res)=>{
	var data = req.body;
	if(!data.descripcion || !data.tipo_credito || !data.tiempo || ! data.interes_credito) return res.sql(403).send(`Error no se enviarion todos los campos`);

	console.log(data);
	var sql = `INSERT INTO creditos VALUES(NULL,'${data.descripcion}','${data.tipo_credito}','${data.tiempo}','${data.interes_credito}', 1)`;
	var connection = dbConnection();
	connection.query(sql,(err,result)=>{
		if(err) res.status(500).send({message:`ERROR No se guardo  la consulta ${sql}`});
		if(!err ){
			console.log(sql);
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}


function updateTipo(req,res){
	var idcredito = req.params.id;
    var data = req.body;
    if(!data.descripcion || !data.tipo_credito || !data.tiempo || ! data.interes_credito || !data.estado) return res.sql(403).send(`Error no se enviarion todos los campos`);
    var sql = `UPDATE creditos SET descripcion='${data.descripcion}', tipo_credito='${data.tipo_credito}', tiempo='${data.tiempo}', interes_credito = '${data.interes_credito}', estado='${data.estado}'   WHERE idcredito=${idcredito}`;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!err){
            res.status(200).send({result:`tipo credito modificada con exito`});
        }
        connection.destroy();
    });
}

function eliminarTipo(req,res){

}

let prueba = (req,body) =>{
	res.status(200).send({message:'esto es una prueba'});
}


module.exports={
	getTipos,
	getTipo,
	nuevoTipo,
	updateTipo,
	eliminarTipo,
	prueba
}