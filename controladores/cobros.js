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
    var hoy=moment().format('YYYY-MM-DD');
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
        connection_cobro.destroy();
    })
};


function cobrosXRealizarDia(req,res){
    var sql = `
    SELECT 
    clientes.idcliente as cliente_idcliente,
    clientes.nombres as cliente_nombres,
    clientes.app_pat as cliente_app_pat,
    clientes.app_mat as cliente_app_mat,
    clientes.telefono as cliente_telefono,
    negocios.idnegocio as negocio_idnegocio,
    negocios.callenum as negocio_callenum,
    negocios.colonia as negocio_colonia,
    negocios.municipio as negocio_municipio,
    negocios.poblacion as negocio_poblacio,
    negocios.tipo_negocio as negocio_tipo_negocio,
    negocios.nombre_negocio as negocio_nombre_negocio,
    cobros.idcobro as cobro_idcobro,
    cobros.cantidad_cobro as cobro_cantidad_cobro,
    cobros.fecha_cobro as cobro_fecha_cobro,
    prestamos.idprestamo as prestamo_idprestamo,
    prestamos.monto_solicitado as prestamo_monto_solicitado,
    prestamos.monto_conInteres as prestamo_monto_conInteres,
    prestamos.interes as prestamo_interes,
    creditos.idcredito as credito_idcredito,
    creditos.descripcion as credito_descripcion,
    empleados.idempleado as empleado_idempleado,
    empleados.nombres as empleado_nombre
    FROM cobros
    INNER JOIN clientes on cobros.idcliente = clientes.idcliente
    INNER JOIN negocios on clientes.idcliente = negocios.idcliente AND clientes.idcliente = cobros.idcliente
    INNER JOIN prestamos on cobros.idprestamo = prestamos.idprestamo
    INNER JOIN creditos on prestamos.tipo_credito = creditos.idcredito AND prestamos.idprestamo = cobros.idprestamo
    INNER JOIN empleados on cobros.idempleado = empleados.idempleado
    `
    var connection = dbConnection();
    var data = [];
    var hoy = moment().format('YYYY-MM-DD')
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){
            for(let i=0; i< result.length; i++){
                var dateObj = new Date((result[i].cobro_fecha_cobro));
                var momentObj = moment(dateObj);
                var momentString = momentObj.format('YYYY-MM-DD');
                 console.log(momentString);
                if(moment(momentString).isSame(hoy)){
                    data.push(result[i]);
                }
            }
            console.log(`Data--->`);
            console.log(data);
            res.status(200).send({result:data});
            }
        connection.destroy();
    });
}

module.exports={
    getCobros,
    getCobrosPorCliente,
    getCobrosXRealizar,
    getCobrosAtrasados,
    getCobrosAtrasados,
    getCobrosAtrasadosXCliente,
    cobrosXRealizarDia
}