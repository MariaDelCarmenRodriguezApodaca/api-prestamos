'use strict'
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;
var cloudinary = require('cloudinary');

function addCliente(req,res){
	var data = req.body;
	console.log('Data:',data);
	if(!data.nombres || !data.app_pat || !data.app_mat || !data.telefonos) return res.status(403).send({message:`No se enviaron todos los datos, datos enviados ${data}`});
	var sql = `INSERT INTO clientes VALUES (null,'${data.nombres}','${data.app_pat}','${data.app_mat}','${data.telefonos}',null,null,'Activo')`;
	var connection = dbConnection();
	connection.query(sql,(err,result)=>{
		if(!err){
			res.status(200).send({result:result,sql:sql});
		}else res.status(500).send({message:`ERROR ocurrio un error al añadir al cliente ${err} ---> sql: ${sql}`});
		connection.destroy();
	});
}

function updateCliente(req,res){
	var data=req.body;
	if(!data.nombres || !data.app_pat || !data.app_mat || !data.telefonos || data.status) return res.status(403).send({message:`No se enviaron todos los datos, datos enviados ${data}`});
	var sql= `UPDATE clientes SET nombres='${data.nombres}', app_pat='${data.app_pat}', app_mat='${data.app_mat}',telefonos='${data.telefonos}', status='${data.status}'`;
	var connection= dbConnection();
	connection.query(sql,(err,result)=>{
		if(!err ){
			res.status(200).send({result:result,sql:sql});
		}else res.status(500).send({message:`ERROR ocurrio un error al actualizar al cliente ${err} ---> sql: ${sql}`});
		connection.destroy();
	});
}
 
function getClientes(req,res){
	var connection = dbConnection();
	connection.query(`SELECT * FROM clientes`,(err,result,fields)=>{
		if(!err){
			res.status(200).send({result:result});
		}else res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		connection.destroy();
	});
}

function getCliente(req,res){
	var data = req.params;
	var idCliente = data.id;
	var connection=dbConnection();
	connection.query(`SELECT * FROM clientes WHERE idcliente= '${idCliente}'`,(err,result,fields)=>{
		if(!err){
			res.status(200).send({result:result});
		}else res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		connection.destroy();
	});
}

function uploadImageIne(req,res){
	var idcliente = req.params.id;
	if(req.files){
		console.log('Llego un archivo al servidor');
		console.log(req.files.image);
		var ruta_temporal = req.files.image.path; //el campo que enviamos se llama image
        cloudinary.v2.uploader.upload(ruta_temporal,(err,result)=>{
			if(!err){
				var imagen_ine = `${result.url},${result.public_id}`;
				var sql = `UPDATE clientes SET imagen_ine = '${imagen_ine}' WHERE idcliente=${idcliente}`;
				var connection = dbConnection();
				connection.query(sql,(err,result)=>{
					if(!err){
						console.log(`Imagen ine actualizada de cliente: ${idcliente}`);
						res.status(200).send(result);
					}else res.status(500).send({message:`Error, al actualizar imagen_ine en la base de datos`});
					connection.destroy();
				});
			}else res.status(500).send({message:`Error, al subir imagen ine a cloudinary: ${err}`})
		});
	}else res.status(500).send({message:'Error, no se envio ningun archivo'});
}

function uploadImageDireccion(req,res){
	var idcliente = req.params.id;
	if(req.files){
		console.log('Llego un archivo al servidor');
		console.log(req.files.image);
		var ruta_temporal = req.files.image.path; //el campo que enviamos se llama image
        cloudinary.v2.uploader.upload(ruta_temporal,(err,result)=>{
			if(!err){
				var imagen_direccion = `${result.url},${result.public_id}`;
				var sql = `UPDATE clientes SET imagen_direccion = '${imagen_direccion}' WHERE idcliente=${idcliente}`;
				var connection = dbConnection();
				connection.query(sql,(err,result)=>{
					if(!err){
						console.log(`Imagen ine actualizada de cliente: ${idcliente}`);
						res.status(200).send(result);
					}else res.status(500).send({message:`Error, al actualizar imagen_ine en la base de datos`});
					connection.destroy();
				});
			}else res.status(500).send({message:`Error, al subir imagen ine a cloudinary: ${err}`})
		});
	}else res.status(500).send({message:'Error, no se envio ningun archivo'});
}

module.exports={
	addCliente,
	updateCliente,
	getClientes,
	getCliente,
	uploadImageIne,
	uploadImageDireccion
}