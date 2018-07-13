'use strict'
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

function getCobros(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM cobros `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

module.exports={
    getCobros
}