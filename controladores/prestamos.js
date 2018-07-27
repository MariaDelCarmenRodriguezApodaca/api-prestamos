'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getPrestamos=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM prestamos `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

function getPrestamosSinAprobar(req,res){
    var connection = dbConnection();
    var sql = `
    SELECT idprestamo,prestamos.idcliente,prestamos.idnegocio,idsucursal,fecha_solicitud,monto_solicitado,monto_interes,
    monto_conInteres,empleado_captura,prestamos.tipo_credito,prestamos.status,fecha_aprobacion,prestamos.tiempo,interes,
    nombres as cliente_nombre, negocios.nombre_negocio as cliente_negocio, clientes.telefono as cliente_telefono, creditos.descripcion as
    creditos_descripcion, clientes.nombres as cliente_nombres, clientes.app_pat as cliente_app_pat, clientes.app_mat as cliente_app_mat,
    negocios.tipo_negocio FROM prestamos INNER JOIN clientes ON prestamos.idcliente = clientes.idcliente 
    INNER JOIN negocios ON prestamos.idnegocio = negocios.idnegocio 
    INNER JOIN creditos On prestamos.tipo_credito = creditos.idcredito 
    WHERE prestamos.status ='?'
    `;
    connection.query(sql, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}


function nuevoPrestamo(req,res){
    // Al llegar un nuevo prestamo se genera 1 encuesta vacia 
    var data =  req.body;
    var sql='';
    console.log(data);
    // Valores que no pueden faltar: 
    if(
        !data.idcliente,
        !data.idnegocio,
        !data.idsucursal,
        !data.idempresa,
        !data.monto_solicitado,
        !data.empleado_captura,
        !data.tipo_credito
    ){
        return res.status(403).send('ERROR!, No se enviaron todos los datos...');
    }
    var fecha_actual= moment().format('YYYY-MM-DD'); //la fecha de la solicitud aqui se calcula.
    // para sacar el interes se tiene que hacer una consulta a tipos de credito.
    // El tiempo del prestamo esta en tipo credito
    // calcular el monto con el interes,
    //la fecha de aprobacion aun esta en nula,
    // El interes se calculara con el monto_interes y el monto_solicitado
    var connection=dbConnection();
    connection.query(`SELECT * FROM creditos WHERE idcredito=${data.tipo_credito}`,(err,result,fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            var tiempo, interes, monto_conInteres, monto_interes, status;
            tiempo=result[0].tiempo;
            interes=result[0].interes_credito;
            monto_interes=data.monto_solicitado*(interes/100);
            monto_conInteres=parseFloat(data.monto_solicitado)+parseInt(monto_interes);
            status='?';
            //buscar datos del cliente:
            var connection2=dbConnection();
            connection2.query(`SELECT * FROM clientes WHERE idcliente=${data.idcliente}`,(err,result,fields)=>{
                if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
                if(!err){
                    var nombre_cliente = `${result[0].nombres} ${result[0].app_pat} ${result[0].app_mat}`;
                    var telefono_cliente = result[0].telefono
                    //generar la encuesta:
                    sql='INSERT INTO encuestas VALUES'+
                        `(null,${data.idcliente},'${fecha_actual}',null,null,'${nombre_cliente}',null,null,null,null,null,null,'${telefono_cliente}',null,null,${data.idnegocio},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Pendiente')`;
                    var connection3=dbConnection();
                    connection3.query(sql,(err,result)=>{
                        if(err) res.status(500).send({message:`ERROR ocurrio un error al añadir al cliente ${err} ---> sql: ${sql}`});
                        if(!err){
                            console.log(sql,'<=   se guaro la encuesta   =>',result);
                            sql='INSERT INTO prestamos VALUES'+
                                `(null,${data.idcliente},${data.idnegocio},${data.idsucursal},${data.idempresa},'${fecha_actual}','${data.monto_solicitado}','${monto_interes}','${monto_conInteres}','${data.empleado_captura}','${data.tipo_credito}','?',null,'${tiempo}','${interes}',null)`;
                            var connection4=dbConnection();
                            connection4.query(sql,(err,result)=>{
                                if(err) res.status(500).send({message:`ERROR ocurrio un error al añadir al cliente ${err} ---> sql: ${sql}`});
                                if(!err ){
                                    console.log('Prestamo y encuesta registrada con exito');
                                    res.status(200).send({result:result});
                                }
                                connection4.destroy();
                            });
                        }
                        connection3.destroy();
                    });
               }
                connection2.destroy();
            }); 
        }
        connection.destroy();
    });
}

function aprobarRechazarPrestamo(req,res){
    if(!req.body.status || !req.body.monto_aprobado){ return res.status(403).send({message:`No se enviaron todos los datos`});}
    var idprestamo = req.params.id;
    var status = req.body.status;
    var monto_aprobado = (status=='A') ?req.body.monto_aprobado :0;
    console.log({idprestamo:req.body});
    var sql=`UPDATE prestamos SET status='${status}', monto_aprobado='${monto_aprobado}' WHERE idprestamo=${idprestamo}`;
    console.log('Primera sql ---> ',sql);
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(err) res.status(500).send({message:`ERROR ocurrio un error en mysql ${err} ---> sql: ${sql}`});
        if(!result) res.status(404).send({message:`No se pudo actualizar prestamo ---> sql : ${sql}`});
        if(!err && result ){
            if(status=='A'){
                // se obtienen los datos del prestamo: 
                sql=`SELECT * FROM prestamos WHERE idprestamo=${idprestamo}`;
                console.log('Segunda sql ---> ',sql);
                var connection2=dbConnection();
                connection2.query(sql,(err,result)=>{
                    if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
                    if(result.length < 1)  res.status(404).send({message:`No se encontraron clientes`});
                    if(!err && result.length >= 1){
                        var idcredito = result[0].tipo_credito;
                        var tiempo = result[0].tiempo;
                        var idcliente = result[0].idcliente;
                        var empleado_captura = result[0].idempleado;
                        console.log('Calculando cobro unitario');
                        var cobro_unitario = monto_aprobado / parseInt(tiempo);
                        console.log('cobro unitario : ',cobro_unitario);
                        // obtenemos datos del tipo de credito:
                        sql = `SELECT * FROM creditos WHERE idcredito=${idcredito}`;
                        console.log('Tercera sql ---> ',sql);
                        var connection3= dbConnection();
                        connection3.query(sql,(err,result)=>{
                            if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
                            if(result.length < 1)  res.status(404).send({message:`No se encontraron creditos`});
                            if(!err && result.length >= 1){
                                var credito_tipo_credito = result[0].tipo_credito;
                                var addMoment = '';
                                switch(credito_tipo_credito) {
                                case 'Pagos Diarios':
                                    addMoment = 'days';
                                    break;
                                case 'Pagos Semanales':
                                    addMoment = 'weeks';
                                    break;
                                case 'Pagos Mensuales':
                                    addMoment = 'months'
                                    break;
                                }
                                var values = [];
                                var fecha_moment  = moment().add(1,`${addMoment}`);
                                for(var i=1; i <= tiempo ; i++ ){
                                    values.push(['null',idprestamo,idcliente,empleado_captura,fecha_moment.format('YYYY-MM-DD'),cobro_unitario,'null','null','Pendiente']);
                                    fecha_moment  = moment().add(i+1,`${addMoment}`);
                                }
                                var cobros_sql = `INSERT INTO cobros (idcobro,idprestamo,idcliente,idempleado,fecha_cobro,cantidad_cobro,comentario_cobro,imagen_cobro,status) VALUES ?`;
                                var connection4=dbConnection();
                                connection4.query(cobros_sql,[values],(err,result)=>{
                                    if (err) console.log(`Error en la coneccion 3 ${err} --->sql = ${cobros_sql}`);
                                    if(!err){
                                        console.log("Number of records inserted: " + result.affectedRows);
                                        console.log(`Los cobros se insertaran de la siguiente manera: ${cobros_sql}`);
                                        res.status(200).send({result:`Prestamo y cobros guardados con exito`});
                                    }connection4.destroy()
                                });
                            }
                            connection3.destroy();
                        });
                        
                    }
                    connection2.destroy();
                });
            }else{
                res.status(200).send({result:`Prestamo rechazado con exito`});
            }
        }
        connection.destroy();
    });
}

module.exports={
    getPrestamos,
    getPrestamosSinAprobar,
    aprobarRechazarPrestamo,
    nuevoPrestamo
}