'use strict'
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

function getCobros(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM cobros `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
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
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getCobrosXRealizar(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM cobros WHERE status='Pendiente' `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
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
        if(!err){

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
        if(!err){

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
        clientes.telefonos as cliente_telefono,
        negocios.idnegocio as negocio_idnegocio,
        investigaciones.direccion_negocio as investigaciones_direccion_negocio,
        negocios.tipo as negocio_tipo,
        negocios.nombre as negocio_nombre,
        cobros.idcobro as cobro_idcobro,
        cobros.cantidad_cobro as cobro_cantidad_cobro,
        cobros.fecha_cobro as cobro_fecha_cobro,
        cobros.status as cobro_status,
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
        INNER JOIN investigaciones on clientes.idcliente = investigaciones.idcliente
        INNER JOIN prestamos on cobros.idprestamo = prestamos.idprestamo
        INNER JOIN creditos on prestamos.tipo_credito = creditos.idcredito AND prestamos.idprestamo = cobros.idprestamo
        INNER JOIN empleados on cobros.idempleado = empleados.idempleado
    `
    var connection = dbConnection();
    var data = [];
    var hoy = moment().format('YYYY-MM-DD');
    var pagoCompelto=0;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!result)  res.status(404).send({message:`No se encontraron cobros`});
        if(!err && result){
            for(let i=0; i< result.length; i++){
                var dateObj = new Date((result[i].cobro_fecha_cobro));
                var momentObj = moment(dateObj);
                var momentString = momentObj.format('YYYY-MM-DD');
                 console.log(momentString);
                var status =result[i].cobro_status;
                if(status=='Pendiente'){
                    if(status=='Pendiente' && result[i].cobro_fecha_cobro==hoy || moment(momentString).isBefore(hoy) ){
                        // console.log(moment(momentString)+'='+hoy)
                        console.log('--------->status', result[i].cobro_status);
                        data.push(result[i]);
                    }
                }
                if(status=='Pendiente'){
                    pagoCompelto += result[i].cobro_cantidad_cobro;
                }
                
            }

            console.log(`Data--->`);
            console.log(data);
            console.log(`Pago completo ${pagoCompelto}`);
            
            res.status(200).send({'result':data,'completo':pagoCompelto});
            }
        connection.destroy();
    });
}

function pagoRequerido(req,res){
    var idcobro= req.body.cobro.cobro_idcobro;
    var comentario = req.body.comentario
    console.log(idcobro+'   '+comentario)
    var connection = dbConnection();
    var sql=`Update cobros SET status='Pagado', comentario_cobro='${comentario}' WHERE idcobro=${idcobro}`
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err}`});
        if(!result) res.status(404).send({message:`ERROR !result`});
        if(!err && result){
            res.status(200).send({result:`cobro modificada con exito`});
        }
        connection.destroy();
    });

}
function pagoCompleto(req,res){
    var idprestamo= req.body.cobro.prestamo_idprestamo;
    var comentario = req.body.comentario
    var connection = dbConnection();
    var sql =`Update cobros SET status='Pagado', comentario_cobro='${comentario}' WHERE idprestamo=${idprestamo} AND status='Pendiente'`
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ${err} --- sql${sql}`});
        if(!result) res.status(404).send({message:`ERROR !result`});
        if(!err && result){
            res.status(200).send({result:`cobros modificada con exito`});
        }
        connection.destroy();
    });
}


function pagoExacto(req,res){
    var info_cobro = req.body.cobro;
    //var info_cobro=req.body.cobro; //datos del cobro
    var cantidad_a_pagar=req.body.cantidad; //cantidad exacta que se abonara 
    var comentario = req.body.comentario;
    var sql;//para las consultas a la bd.
    console.log(req.body);
    var connection = dbConnection()
    connection.connect((err)=>{
        if(!err){
            sql=`SELECT * FROM cobros WHERE idprestamo=${info_cobro.prestamo_idprestamo} AND status = 'Pendiente'`;
            connection.query(sql,(err,cobros)=>{
                if(!err){
                    if(cantidad_a_pagar >= parseFloat(cobros[0].cantidad_cobro)  && cantidad_a_pagar > 0 ){ 
                        console.log('paso la condicion 1 --> if(cantidad_a_pagar > info_cobro.cobro_cantidad_cobro) ');
                            console.log('entro -------------------');
                            for(let i=0; i < cobros.length ; i++){
                                var idcobro = cobros[i].idcobro;
                                if( parseFloat(cobros[i].cantidad_cobro) > parseFloat(cantidad_a_pagar)  ) {
                                    console.log(`Paso la condicion 2: --> ${cobros[i].cantidad_cobro} > ${cantidad_a_pagar}`);
                                    var nueva_c= parseFloat(cobros[i].cantidad_cobro) - parseFloat(cantidad_a_pagar);
                                    console.log(nueva_c);
                                    sql = `UPDATE cobros SET cantidad_cobro='${nueva_c}', comentario_cobro='${comentario}' WHERE idcobro=${cobros[i].idcobro}`;
                                    i = cobros.length + 1;
                                    cantidad_a_pagar = 0.00;
                                    connection.query(sql,(err,result)=>{
                                        if(!err){
                                            i = cobros.length;
                                            res.status(200).send(result);
                                        }else{
                                            cantidad_a_pagar = req.body.cantidad;
                                            res.status(500).send({message:`Error al actualizar: ${err}`});
                                        } 
                                        connection.destroy();
                                    });
                                }else if( parseFloat(cobros[i].cantidad_cobro) <= cantidad_a_pagar){
                                    cantidad_a_pagar = parseFloat(cantidad_a_pagar) - parseFloat(cobros[i].cantidad_cobro); 
                                    console.log(`Paso la condicion 3: --> ${cobros[i].cantidad_cobro} <= ${cantidad_a_pagar}`);
                                    sql = `UPDATE cobros SET status='Pagado', comentario_cobro='${comentario}' WHERE idcobro=${cobros[i].idcobro}`;
                                    connection.query(sql,(err,resultUpdate)=>{
                                        if(!err){
                                            console.log(cantidad_a_pagar); 
                                        }else{
                                            cantidad_a_pagar = parseFloat(cantidad_a_pagar) + parseFloat(cobros[i].cantidad_cobro); 
                                            res.status(500).send({message:`Error al hacer update ${err}`});
                                        }
                                    });
                                }
                            }    
                    }else res.status(500).send({message:`Error en la consulta ${err}, sql==> ${sql}`});
                }else{
                    console.log(err);
                    connection.destroy();
                    console.log(info_cobro);
                }
            });
        }else {
            connection.destroy();
            res.status(500).send({message:`Error al conectar con la bd ${err}`});
        }
    });
    
}


module.exports={
    getCobros,
    getCobrosPorCliente,
    getCobrosXRealizar,
    getCobrosAtrasados,
    getCobrosAtrasados,
    getCobrosAtrasadosXCliente,
    cobrosXRealizarDia,
    pagoRequerido,
    pagoCompleto,
    pagoExacto
}