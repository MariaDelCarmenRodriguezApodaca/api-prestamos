const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;
const cloudinary = require('cloudinary');

var mysql = require('mysql');
var pool  = config.pool;


function addNegocio(req,res){
    var data = req.body;
    var sql; 
    if(!data.idcliente || !data.nombre || !data.tipo || !data.descripcion_giro || !data.idzona || !data.comentarios) return res.status(403).send({message:`No se enviaron todos los datos`})
    
    pool.getConnection((err,connection)=>{
        if(!err){
            sql = `INSERT INTO negocios VALUES (null,${data.idcliente},'${data.nombre}','${data.descripcion_giro}','${data.tipo}',${data.idzona},'${data.comentarios}')`;
            connection.query(sql,(err,result)=>{
                if(!err){
                    var fecha_investigacion = moment().format('YYYY-MM-DD');
                    sql= `SELECT * FROM zonas WHERE idzona=${data.idzona}`;
                    connection.query(sql,(err,zonas)=>{
                        if(!err){
                            var z=zonas[0];
                            console.log('Zonas: ',z);
                            sql=`SELECT * FROM investigaciones WHERE idcliente=${data.idcliente}`;
                            connection.query(sql,(err,investigaciones)=>{
                                if(!err){
                                    console.log('Investigaciones: ',investigaciones);
                                    var i = investigaciones[0];
                                    if(i.length > 0){
                                        console.log('El cliente SI tenia una investigacion previa');
                                        sql = `INSERT INTO investigaciones VALUES ( null, 
                                            '${fecha_investigacion}',
                                            '${z.idzona}',
                                            '${z.idempleado}', 
                                            '${i.telefonos}',
                                            '${i.idcliente}',
                                            '${i.nombre_completo}', 
                                            '${i.fecha_nacimiento}',
                                            '${i.edad}',
                                            '${i.estado_civil}',
                                            '${i.direccion_hogar}', 
                                            '${i.hogar_propio_orentado}',
                                            '${i.numero_dependientes_economicos}', null, 
                                            '${i.tipo_comprobante}', 
                                            null, null, null, null, null, null, null, null, null, null, null, null, null
                                        )`;
                                        connection.query(sql,(err,result)=>{
                                            if(!err){
                                                console.log('Negocio añadido exitosamente e investigacion generada con datos existentes');
                                                res.status(200).send({result}); 
                                            }else res.status(500).send({message:`Error insertar en la bd: ${err}`});
                                        });
                                    }else {
                                        console.log('El cliente NO tenia una investigacion previa');
                                        sql = `SELECT * FROM clientes WHERE  idcliente=${data.idcliente}`;
                                        connection.query(sql,(err,clientes)=>{
                                            if(!err){
                                                console.log('Cliente: ',clientes);
                                                var c = clientes[0];
                                                sql = `INSERT INTO investigaciones VALUES(
                                                    null,
                                                    '${fecha_investigacion}',
                                                    '${z.idzona}',
                                                    '${z.idempleado}',
                                                    '${c.telefonos}',
                                                    '${c.idcliente}',
                                                    '${c.nombres} ${c.app_pat} ${c.app_mat}',
                                                    null, null,null,null,null, null,null,null,null, null,null,
                                                    '${data.tipo}',
                                                    null,null, null,null,null,null,null,null, null
                                                )`; 
                                                connection.query(sql,(err,result)=>{
                                                    if(!err){
                                                        console.log('Negocio guardado con exite e investigacion nueva registrada',result);
                                                        res.status(200).send({result}); 
                                                    }else res.status(500).send({message:`Error insertar en la bd: ${err}`});
                                                }); 
                                            }else res.status(500).send({message:`Error consultar en la bd: ${err}`});
                                        });
                                    }
                                }else res.status(500).send({message:`Error consultar en la bd: ${err}`});
                            });
                        }else res.status(500).send({message:`Error consultar en la bd: ${err}`});
                    });
                }else res.status(500).send({message:`Error insertar en la bd: ${err}`});
            });
        }else res.status(500).send({message:`Error al conectar con la bd: ${err}`});
        connection.release();
    });
};





function getNegocios(req,res){
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios `, (err, result, fields)=>{
        if(!err){
            res.status(200).send({result:result});
        }else res.status(500).send({message:`Error en la consulta ${err}`});
        connection.destroy();
    });
}

function getNegocio(req,res){
    var idNegocio = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM negocios WHERE idnegocio = ${idNegocio} `, (err, result, fields)=>{
        if(!err){
            res.status(200).send({result:result});
        }else res.status(500).send({message:`Error en la consulta ${err}`});
        connection.destroy();
    });
}


function uploadImageNegocio(req,res){
    var idnegocio = req.params.id;
	if(req.files){
		console.log('Llego un archivo al servidor');
		console.log(req.files.image);
		var ruta_temporal = req.files.image.path; //el campo que enviamos se llama image
        cloudinary.v2.uploader.upload(ruta_temporal,(err,result)=>{
			if(!err){
                var url = result.url;
                var public_id = result.public_id; 
				var sql = `INSERT INTO fotos_negocios VALUES (null, ${idnegocio}, '${public_id}', '${url}')`;
				var connection = dbConnection();
				connection.query(sql,(err,result)=>{
					if(!err){
						console.log(`Imagen del negocio añadida: ${idnegocio}`);
						res.status(200).send(result);
					}else res.status(500).send({message:`Error, al añadir la imagen del negocio ${err}`});
					connection.destroy();
				});
			}else res.status(500).send({message:`Error, al subir imagen ine a cloudinary: ${err}`})
		});
	}else res.status(500).send({message:'Error, no se envio ningun archivo'});
}

function updateImageNegocio(req,res){
    var public_id_param = req.params.id;
	if(req.files){
		console.log('Llego un archivo al servidor');
		console.log(req.files.image);
        var ruta_temporal = req.files.image.path; //el campo que enviamos se llama image
        cloudinary.v2.uploader.destroy(public_id_param,(err,result)=>{
            if(!err){
                cloudinary.v2.uploader.upload(ruta_temporal,(err,result)=>{
                    if(!err){
                        var url = result.url;
                        var public_id = result.public_id; 
                        var sql = `UPDATE fotos_negocios SET url='${url}', public_id='${public_id}' WHERE public_id='${public_id_param}'`;
                        var connection = dbConnection();
                        connection.query(sql,(err,result)=>{
                            if(!err){
                                console.log(`Imagen del negocio Actualizada: ${url}`);
                                res.status(200).send(result);
                            }else res.status(500).send({message:`Error, al añadir la imagen del negocio ${err}`});
                            connection.destroy();
                        });
                    }else res.status(500).send({message:`Error, al subir imagen ine a cloudinary: ${err}`})
                });
            }else res.status(500).send({message:`Error al eliminar a imagen ${err}`});
        });
	}else res.status(500).send({message:'Error, no se envio ningun archivo'});
}



module.exports={
	getNegocios,
    getNegocio,
    addNegocio,
    uploadImageNegocio,
    updateImageNegocio
}