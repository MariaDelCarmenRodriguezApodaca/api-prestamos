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

function getCobrosPorCliente(req,res){
    var idCliente = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM cobros WHERE idcliente='${idCliente}' `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getCobrosXRealizar(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM cobros WHERE status='Pendiente' `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
};

function getCobrosAtrasados(req,res){
    var connection = dbConnection();
    var atrasados = [];
    var hoy=moment().format('YYYY-MMM-DD');
    connection.query(`SELECT * FROM cobros`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){

            console.log(result[0].fecha_cobro);

            for(let i=0; i< result.length; i++){
                var dateObj = new Date((result[i].fecha_cobro));
                var momentObj = moment(dateObj);
                var momentString = momentObj.format('YYYY-MM-DD');
                console.log(momentString);

                if(moment(momentString).isBefore(hoy)){
                    atrasados.push(result[i]);
                }

            }

            if(atrasados.length >= 1){
              res.status(200).send({result:atrasados});  
          }else{
            res.status(404).send({message:`No hay cobros atrasados`}); 
          }
            
        }
        connection.destroy();
    })
};

function getCobrosAtrasadosXCliente(req,res){
    var idcliente = req.params.id;
    var connection = dbConnection();
    var atrasados = [];
    var hoy=moment().format('YYYY-MMM-DD');
    connection.query(`SELECT * FROM cobros WHERE idcliente = ${idcliente} AND status = 'Pendiente'`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){

            console.log(result[0].fecha_cobro);

            for(let i=0; i< result.length; i++){
                var dateObj = new Date((result[i].fecha_cobro));
                var momentObj = moment(dateObj);
                var momentString = momentObj.format('YYYY-MM-DD');
                console.log(momentString);

                if(moment(momentString).isBefore(hoy)){
                    atrasados.push(result[i]);
                }

            }

            if(atrasados.length >= 1){
              res.status(200).send({result:atrasados});  
          }else{
            res.status(404).send({message:`No hay cobros atrasados`}); 
          }
            
        }
        connection.destroy();
    })
};

module.exports={
    getCobros,
    getCobrosPorCliente,
    getCobrosXRealizar,
    getCobrosAtrasados,
    getCobrosAtrasados,
    getCobrosAtrasadosXCliente
}