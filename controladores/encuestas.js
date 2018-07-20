'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


function getEncuestas(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron encuestas`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
function getEncuestasPendientes(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas WHERE status='Pendiente'`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron encuestas`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
function getEncuestasTerminadas(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas WHERE status='Terminada'`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron encuestas`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
let getEncuesta = (req,res)=>{
    var idencuesta= req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas WHERE idencuesta = ${idencuesta} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron encuestas`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
function nuevaEncuesta(req,res){
    var data = req.body;
    if(!data.idcliente ||
        !data.representante ||
        !data.nombre_ruta ||
        !data.nombre_cliente ||
        !data.fecha_nacimiento ||
        !data.edad ||
        !data.comprobante_envia ||
        !data.domicilio ||
        !data.domicilio_propio_rentado ||
        !data.dependientes_economicos ||
        !data.telefono ||
        !data.monto_solicitado ||
        !data.monto_autorizado ||
        !data.idnegocio ||
        !data.giro_negocio ||
        !data.ingresos_semanales ||
        !data.propietario_o_empleado ||
        !data.antiguedad_negocio ||
        !data.contrato_arrendamiento ||
        !data.ubicacion ||
        !data.hora_laboran ||
        !data.nombre_aval ||
        !data.antiguedad_conocerse ||
        !data.telefono_aval ||
        !data.nombre_familiar ||
        !data.parentesco ||
        !data.telefono_familiar ||
        !data.como_supo ||
        !data.fecha_liberacion 
        )return res.status(403).send({message:'No se enviarion todos los datos',data});
        var connection=dbConnection();
        var fecha_actual= moment().format('YYYY/MM/DD');
        var sql=`INSERT INTO encuestas VALUES(null,'${data.idcliente}','${fecha_actual}','${data.representante}','${data.nombre_ruta}','${data.nombre_cliente}','${data.fecha_nacimiento}', '${data.edad}','${data.comprobante_envia}','${data.domicilio}',  '${data.domicilio_propio_rentado}', '${data.dependientes_economicos}', '${data.telefono}', '${data.monto_solicitado}','${data.monto_autorizado}','${data.idnegocio}','${data.giro_negocio}','${data.ingresos_semanales}','${data.propietario_o_empleado}','${data.antiguedad_negocio}','${data.contrato_arrendamiento}','${data.ubicacion}','${data.hora_laboran}','${data.nombre_aval}','${data.antiguedad_conocerse}','${data.telefono_aval}','${data.nombre_familiar}','${data.parentesco}','${data.telefono_familiar}','${data.como_supo}','${data.fecha_liberacion}','Perdiente' ) `;
        connection.query(sql,(err,result)=>{
            if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
            if(!result)  res.status(403).send({message: `Ha ocurrido un ERROR.... ${sql}`});
            if(!err && result){
                res.status(200).send({result:result});
            }
            connection.destroy();
        })
}

module.exports={
    getEncuestas,
    getEncuesta,
    nuevaEncuesta,
    getEncuestasPendientes,
    getEncuestasTerminadas
}