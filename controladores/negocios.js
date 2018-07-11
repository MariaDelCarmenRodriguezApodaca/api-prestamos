const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getNegocios=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron negocios`});
        if(!err && result.length >= 1){
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
        if(result.length < 1)  res.status(404).send({message:`No se encontro al negocio`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}


module.exports={
	getNegocios,
	getNegocio
}