const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getEmpresas=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM empresas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron empresas`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getEmpresa=(req,res)=>{
    var idEmpresa = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM empresas WHERE idEmpresa = ${idEmpresa} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontro a la empresa`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}


module.exports={
	getEmpresas,
	getEmpresa
}