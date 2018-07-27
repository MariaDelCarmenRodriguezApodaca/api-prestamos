'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


function getEncuestas(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
function getEncuestasPendientes(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas WHERE status='Pendiente'`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}
function getEncuestasTerminadas(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM encuestas WHERE status='Terminada'`, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
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
        if(!err){
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
            if(!err){
                res.status(200).send({result:result});
            }
            connection.destroy();
        })
}

function updateEncuesta(req,res){
    var idencuesta=req.params.id;
    var data = req.body;
    var fecha_actual= moment().format('YYYY/MM/DD');
    var sql = `UPDATE encuestas SET idcliente=${data.idcliente},fecha='${fecha_actual}', representante='${data.representante}', nombre_ruta='${data.nombre_ruta}', nombre_cliente ='${data.nombre_cliente}', fecha_nacimiento='${data.fecha_nacimiento}',edad='${data.edad}',comprobante_envia='${data.comprobante_envia}',domicilio='${data.domicilio}',domicilio_propio_rentado='${data.domicilio_propio_rentado}',dependientes_economicos='${data.dependientes_economicos}',telefono='${data.telefono}',monto_solicitado='${data.monto_solicitado}',monto_autorizado='${data.monto_autorizado}',idnegocio='${data.idnegocio}',giro_negocio='${data.giro_negocio}',ingresos_semanales='${data.ingresos_semanales}',propietario_o_empleado='${data.propietario_o_empleado}',antiguedad_negocio='${data.antiguedad_negocio}',contrato_arrendamiento='${data.contrato_arrendamiento}',ubicacion='${data.ubicacion}',hora_laboran='${data.hora_laboran}',nombre_aval='${data.nombre_aval}',antiguedad_conocerse='${data.antiguedad_conocerse}',telefono_aval='${data.telefono_aval}',nombre_familiar='${data.nombre_familiar}',parentesco='${data.parentesco}',telefono_familiar='${data.telefono_familiar}',como_supo='${data.como_supo}',fecha_liberacion='${data.fecha_liberacion}',status='Terminada'  WHERE idencuesta=${idencuesta}`;
    var connection=dbConnection();
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
            if(!err){
                res.status(200).send({result:result});
            }
            connection.destroy();
    })
}

function getEncuestaDetalleSimple(req,res){
    var sql = `
    SELECT
    /*Informacion de la encuesta*/
    encuestas.idencuesta as encuesta_idencuesta,
    encuestas.fecha as encuesta_fecha,
    encuestas.idcliente as encuesta_idcliente,
    encuestas.monto_solicitado as ecuesta_monto_solicitado,
    /*Informacion del cliente*/
    clientes.nombres as cliente_nombre,
    clientes.app_pat as cliente_app_pat,
    clientes.app_mat as cliente_app_mat,
    clientes.telefono as cliente_telefono, 
    /*Informacion del negocio*/
    negocios.idnegocio as negocio_idnegocio,
    negocios.nombre_negocio as negocio_nombre_negocio
    FROM encuestas 
    INNER JOIN clientes ON clientes.idcliente = encuestas.idcliente
    INNER JOIN negocios ON negocios.idnegocio = encuestas.idnegocio
    `;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`Error en la base de datos: ${err} --->sql: ${sql}`});
        if(!err){
            res.status(200).send({result});
        }
        connection.destroy();
    });
}

function getEncuestaDetalleSimpleTerminada(req,res){
    var sql = `
    SELECT
    /*Informacion de la encuesta*/
    encuestas.idencuesta as encuesta_idencuesta,
    encuestas.fecha as encuesta_fecha,
    encuestas.idcliente as encuesta_idcliente,
    encuestas.monto_solicitado as ecuesta_monto_solicitado,
    /*Informacion del cliente*/
    clientes.nombres as cliente_nombre,
    clientes.app_pat as cliente_app_pat,
    clientes.app_mat as cliente_app_mat,
    clientes.telefono as cliente_telefono, 
    /*Informacion del negocio*/
    negocios.idnegocio as negocio_idnegocio,
    negocios.nombre_negocio as negocio_nombre_negocio
    FROM encuestas 
    INNER JOIN clientes ON clientes.idcliente = encuestas.idcliente
    INNER JOIN negocios ON negocios.idnegocio = encuestas.idnegocio
    WHERE encuestas.status='Terminada'
    `;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`Error en la base de datos: ${err} --->sql: ${sql}`});
        if(!err){
            res.status(200).send({result});
        }
        connection.destroy();
    });
}
function getEncuestaDetalleSimplePendiente(req,res){
    var sql = `
    SELECT
    /*Informacion de la encuesta*/
    encuestas.idencuesta as encuesta_idencuesta,
    encuestas.fecha as encuesta_fecha,
    encuestas.idcliente as encuesta_idcliente,
    encuestas.monto_solicitado as ecuesta_monto_solicitado,
    /*Informacion del cliente*/
    clientes.nombres as cliente_nombre,
    clientes.app_pat as cliente_app_pat,
    clientes.app_mat as cliente_app_mat,
    clientes.telefono as cliente_telefono, 
    /*Informacion del negocio*/
    negocios.idnegocio as negocio_idnegocio,
    negocios.nombre_negocio as negocio_nombre_negocio
    FROM encuestas 
    INNER JOIN clientes ON clientes.idcliente = encuestas.idcliente
    INNER JOIN negocios ON negocios.idnegocio = encuestas.idnegocio
    WHERE encuestas.status='Pendiente'
    `;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`Error en la base de datos: ${err} --->sql: ${sql}`});
        if(!err){
            res.status(200).send({result});
        }
        connection.destroy();
    });
}

module.exports={
    getEncuestas,
    getEncuesta,
    nuevaEncuesta,
    getEncuestasPendientes,
    getEncuestasTerminadas,
    updateEncuesta,
    getEncuestaDetalleSimple,
    getEncuestaDetalleSimplePendiente,
    getEncuestaDetalleSimpleTerminada
}