'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

 
let getClientes=(req,res)=>{
	var connection = dbConnection();
	connection.query(`SELECT * FROM clientes`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		if(result.length<1) res.status(404).send({message:`No existen clientes resgistrados`});
		if(!err && result.length>=1 ){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}

let getCliente=(req,res)=>{
	var data = req.params;
	var idCliente = data.id;
	var connection=dbConnection();
	connection.query(`SELECT * FROM clientes WHERE idcliente= '${idCliente}'`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		if(result.length<1) res.status(404).send({message:`No existe el cliente solicitado`});
		if(!err && result.length>=1 ){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}

// falta nuevoCliente()


module.exports={
	getClientes,
	getCliente
}