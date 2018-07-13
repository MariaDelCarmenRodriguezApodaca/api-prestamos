'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

// para la imagen
const fs = require('fs'); //libreria file system de node que permite trabajar con archivos
const path = require('path'); //nos permite trabajar con rutas y ficheros
 
let getClientes=(req,res)=>{
	var connection = dbConnection();
	connection.query(`SELECT * FROM clientes`,(err,result,fields)=>{
		if(err) res.status(500).send({message:`ERROR ocurrio un error en la consulta`});
		if(!result) res.status(404).send({message:`No existen clientes resgistrados`});
		if(!err && result ){
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
		if(!result) res.status(404).send({message:`No existe el cliente solicitado`});
		if(!err && result ){
			res.status(200).send({result:result});
		}
		connection.destroy();
	});
}

let addCliente=(req,res)=>{
	var data = req.body;
	
}

// falta nuevoCliente()


//subir imagenes al servidor
function imagenDireccion(req,res){
	var clienteId= req.params.id;
	if(req.files){
		// tomamos el path de la image
		var file_path = req.files.image.path;
		console.log('file_path: ----->',file_path);
		//dividimos el path por las \ que contenga
		var file_split = file_path.split('\\');
		console.log('file_split: ----->',file_split);
		//tomamos el nombre el fichero
		var file_name = file_split[2];
		console.log('file_name: ----->',file_name);
		//tomamos la extencion del archivo
		var extencion_split = file_name.split('\.'); //cortamos el split cpor el punto como es caracter especial ponemos el \
		var file_extencion = extencion_split[1];
		console.log('file_extencion: ----->',file_extencion);
		//comprobamos que las extenciones sean correctas:
		if(file_extencion=='png' || file_extencion=='PNG'|| file_extencion == 'jpg' || extencion_split=='jpeg' || file_extencion=='gif'){
			var connection = dbConnection();
			var nuevaPath="'"+file_split[0]+'/'+file_split[1]+'/'+file_split[2]+"'";
			var sql=`UPDATE clientes SET imagen_direccion = '${file_name}' WHERE idcliente = ${clienteId}`;
			connection.query(sql,(err,result)=>{
				if(err) res.status(500).send({message:`ERROR ocurrio un error: ${err} en la consulta sql: ${sql}`});
				if(!result) res.status(404).send({message:`No existe el cliente solicitado sql: ${sql}`});
				if(!err && result){
					res.status(200).send({result:result});
				}
				connection.destroy();
			});
		}else{
			//si no responder y borrar el fichero que se subio con multipart en uploads 
			eliminarArchivo(file_path)//eliminamos el archivo
			res.status(403).send({message:`No se han subido imagene valida`});//notificamos que no envio un archivo valido
		}
	}else{
		res.status(403).send({message:`No se han subido imagenes`});
	}
}

function imagenIne(req,res){
	var clienteId= req.params.id;
	if(req.files){
		var file_path = req.files.image.path;
		console.log('file_path: ----->',file_path);
		var file_split = file_path.split('\\');
		console.log('file_split: ----->',file_split);
		var file_name = file_split[2];
		console.log('file_name: ----->',file_name);
		var extencion_split = file_name.split('\.'); 
		var file_extencion = extencion_split[1];
		console.log('file_extencion: ----->',file_extencion);
		if(file_extencion=='png' || file_extencion == 'jpg' || extencion_split=='jpeg' || file_extencion=='gif'){
			var connection = dbConnection();
			var nuevaPath="'"+file_split[0]+'/'+file_split[1]+'/'+file_split[2]+"'";
			var sql=`UPDATE clientes SET imagen_ine = '${file_name}' WHERE idcliente = ${clienteId}`;
			connection.query(sql,(err,result)=>{
				if(err) res.status(500).send({message:`ERROR ocurrio un error: ${err} en la consulta sql: ${sql}`});
				if(!result) res.status(404).send({message:`No existe el cliente solicitado sql: ${sql}`});
				if(!err && result){
					res.status(200).send({result:result});
				}
				connection.destroy();
			});
		}else{
			//si no responder y borrar el fichero que se subio con multipart en uploads 
			eliminarArchivo(file_path)//eliminamos el archivo
			res.status(403).send({message:`No se han subido imagene valida`});//notificamos que no envio un archivo valido
		}
	}else{
		res.status(403).send({message:`No se han subido imagenes`});
	}
}

function eliminarArchivo(file_path){
	fs.unlink(file_path,(err)=>{
		console.log('archivo eliminado:',file_path)
	});
}

function regresarImg(req,res){
	var image_file = req.params.image_file;
	var image_path='./uploads/clientes/'+image_file;
	// comprobamos que existe
	fs.exists(image_path,(exist)=>{
		if(exist){
			res.sendFile(path.resolve(image_path));
		}else(
			res.status(404).send({message:`No existe la imagen`})
		);
	})

}

function regresarImgRuta(req,res){
	var image_path=req.body.ruta;
	// comprobamos que existe
	fs.exists(image_path,(exist)=>{
		if(exist){
			res.sendFile(path.resolve(image_path));
		}else(
			res.status(404).send({message:`No existe la imagen`})
		);
	})

}

module.exports={
	getClientes,
	getCliente,
	imagenDireccion,
	imagenIne,
	regresarImg,
	regresarImgRuta
}