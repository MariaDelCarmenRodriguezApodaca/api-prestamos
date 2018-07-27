const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getNegocios=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getNegocio=(req,res)=>{
    var idNegocio = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios WHERE idnegocio = ${idNegocio} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getNegocioXCliente(req,res){
    var idcliente = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios WHERE idcliente = ${idcliente} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`}); 
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function addNegocio(req,res){
    var data = req.body;
    if(!data.idcliente || !data.nombre_negocio || !data.callenum ||!data.colonia || !data.estado || !data.municipio || !data.poblacion ||!data.tipo_negocio || !data.giro_negocio) return res.status(403).send({message:`No se enviaron todos los datos`})
    var connection = dbConnection();
    var sql = `INSERT INTO negocios VALUES (null,${data.idcliente},'${data.nombre_negocio}','${data.callenum}','${data.colonia}','${data.estado}','${data.municipio}','${data.poblacion}',null,'${data.tipo_negocio}',${data.giro_negocio})`
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`negocio guardada`});
        }
        connection.destroy();
    });
}


function updateNegocio(req,res){
    var idnegocio = req.params.id;
    var data = req.body;
    if(!data.idcliente || !data.nombre_negocio || !data.callenum ||!data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.giro_negocio) return res.status(403).send({message:`No se enviaron todos los datos`})
    var connection = dbConnection();
    var sql = `UPDATE negocios SET  nombre_negocio='${data.nombre_negocio}', callenum='${data.callenum}', colonia='${data.colonia}',estado='${data.estado}',municipio='${data.municipio}',poblacion='${data.poblacion}',giro_negocio=${data.giro_negocio} WHERE idnegocio=${idnegocio}`
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`negocio actualizado`});
        }
        connection.destroy();
    });
}


module.exports={
	getNegocios,
    getNegocio,
    getNegocioXCliente,
    addNegocio,
    updateNegocio
}