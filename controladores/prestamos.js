'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getPrestamos=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM prestamos `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron prestamos`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getPrestamosSinAprobar(req,res){
    var connection = dbConnection();
    var sql="SELECT idprestamo,prestamos.idcliente,prestamos.idnegocio,idsucursal,fecha_solicitud,monto_solicitado,monto_interes,monto_conInteres,empleado_captura,prestamos.tipo_credito,prestamos.status,fecha_aprobacion,monto_atraso,prestamos.tiempo,interes, nombres as cliente_nombre, negocios.nombre_negocio as cliente_negocio, clientes.telefono as cliente_telefono, creditos.descripcion as creditos_descripcion, clientes.nombres as cliente_nombres, negocios.tipo_negocio FROM prestamos INNER JOIN clientes INNER JOIN negocios INNER JOIN creditos WHERE prestamos.status = '?' and prestamos.idcliente = clientes.idcliente and negocios.idcliente = clientes.idcliente";
    connection.query(sql, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron prestamos sin aprobar`});
        if(!err && result.length >= 1){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function aprobarRechazarPrestamo(req,res){
    var id_prestamo = req.params.id;
    var status = req.body.status;
    if(status!='A' && status !="R") return status(403).send({message:`El status no es correcto`});
    var fecha_actual = moment().format('LLLL');
    var connection = dbConnection();
    var sql=`UPDATE prestamos set status = '${status}', fecha_aprobacion='${fecha_actual}' where idprestamo=${id_prestamo} `;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}   ---> ${sql}`});
        if(!result)  res.status(404).send({message:`No pudo actualizar el status.... ${sql}`});
        if(!err && result){
            res.status(200).send({result:result,sql:sql});
        }
        connection.destroy();
    });
}

function nuevoPrestamo(req,res){
    var data = req.body;
    if(!data.idcliente || !data.idnegocio  || !data.idsucursal || !data.monto_solicitado || !data.tipo_credito || !data.empleado_captura) return res.status(403).send({message:`Faltaron datos, datos enviados ${data}`});
    var idprestamo = 'null';
    var connection = dbConnection();
    //OBTENER EL ID DEL PRESTAMO:
    var sql = `SELECT AUTO_INCREMENT as id_nuevo FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'prestamos'`
    connection.query(sql,(err,resultes)=>{
        if(err)console.log(`Sucedio un error al ver el Auto Incremet del prestamos  ${err}   --->sql : ${sql}`);
        if(result.length < 1)console.log(`No se encontraron resltados de tipos de autoincrement  ---> sql: ${sql}`);
        if(!err && result.length > 1){
            idprestamo=result[0].id_nuevo;
            console.log(`El id del prestamo sera : ${idprestamo}`);
        }
    });
    var idcliente = data.idcliente;
    var idnegocio = data.idnegocio;
    var idsucursal = data.idsucursal;
    var fecha_solicitud = moment.format('LLLL');
    var monto_solicitado = data.monto_solicitado;
    var empleado_captura = data.empleado_captura;
    var tipo_credito = data.tipo_credito; //id del tipo del credito
    // CALCULAR EL MONTO_INTERES, MONTO_CONINTERES
    var interes = 0;
    var tiempo = 0;
    var monto_interes = 0;
    var monto_conInteres =  0;
    var status = '?';
    var fecha_aprobacion = 'null';
    var monto_atraso = 'null'
    connection.query(`SELECT * FROM creditos WHERE idcredito = ${tipo_credito}`,(err,result)=>{
        if(err)console.log(`Sucedio un error al ver el id del credito ${err}   --->sql : ${sql}`);
        if(result.length < 1)console.log(`No se encontraron resltados de tipos de creditos ---> sql: ${sql}`);
        if(!err && result.length > 1){
            interes = result[0].interes_credito;
            tiempo = result[0].tiempo;
            console.log(`El interes sera ${interes}, el tiempo sera ${tiempo}`);
            monto_interes = (interes * 0.1) * monto_solicitado;
            monto_conInteres = monto_solicitado + monto_interes;
        }
        connection.destroy;
    });
    // INSERTAR LOS COBROS EN LA BASE DE DATOS
    var fecha_moment = moment();
    sql = `INSERT INTO cobros VALUES(null,${idprestamo},${idcliente},${empleado_captura})`;
    
}


module.exports={
    getPrestamos,
    getPrestamosSinAprobar,
    aprobarRechazarPrestamo
}