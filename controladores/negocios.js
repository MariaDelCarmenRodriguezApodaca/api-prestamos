const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;
const cloudinary = require('cloudinary');

function addNegocio(req,res){
    var data = req.body;
    if(!data.idcliente || !data.nombre_negocio || !data.callenum ||!data.colonia || !data.estado || !data.municipio || !data.poblacion ||!data.tipo_negocio || !data.giro_negocio || !data.idzona) return res.status(403).send({message:`No se enviaron todos los datos`})
    var connection = dbConnection();
    var sql = `INSERT INTO negocios VALUES (null,${data.idcliente},'${data.nombre_negocio}','${data.callenum}','${data.colonia}','${data.estado}','${data.municipio}','${data.poblacion}','${data.tipo_negocio}',${data.giro_negocio},${data.idzona})`
    connection.query(sql,(err,result)=>{
        if(!err){
            // si el negocio se inservi verifica si ya hay encuesta con el id del cliente: 
            var fecha_investigacion = moment().format('YYYY-MM-DD');
            sql= `SELECT * FROM zonas WHERE idzona=${data.idzona}`;
            var connection1=dbConnection();
            connection1.query(sql,(err,result)=>{
                if(!err){
                    var z = result[0]; //Z z= result de zonas
                    console.log(z);
                    sql=`SELECT * FROM investigaciones WHERE idcliente=${data.idcliente}`;
                    var connection2=dbConnection();
                    connection2.query(sql,(err,result,fields)=>{
                        if(!err){
                            if(result.length >= 1){
                                //si la encontro
                                console.log(`Este cliente SI tenia otra investigacion`, result);
                                var i = result[0]; // i = result de investigaciones
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
                                var connection3=dbConnection();
                                connection3.query(sql,(err,result)=>{
                                    if(!err){
                                        console.log('Negocio añadido exitosamente e investigacion generada con datos existentes');
                                        res.status(200).send({result});
                                    }else res.status(500).send({message:`Error al hacer la consulta en la base de datos ${err} `});
                                    connection3.destroy();
                                });

                            }else{
                                console.log(`Este cliente NO tenia otro negocio`);
                                sql = `SELECT * FROM clientes WHERE  idcliente=${data.idcliente}`;
                                var connection3 = dbConnection();
                                connection3.query(sql,(err,result)=>{
                                if(!err){
                                    console.log(result[0]);
                                    var c = result[0];
                                        sql = `INSERT INTO investigaciones VALUES(
                                            null,
                                            '${fecha_investigacion}',
                                            '${z.idzona}',
                                            '${z.idempleado}',
                                            '${c.telefonos}',
                                            '${c.idcliente}',
                                            '${c.nombres} ${c.app_pat} ${c.app_mat}',
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            'Colonia ${data.colonia}, ${data.callenum}, ${data.poblacion}, ${data.municipio}, ${data.estado}',
                                            null,
                                            null,
                                            '${data.tipo_negocio}',
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null,
                                            null
                                        )`;
                                        console.log(sql);
                                        var connection4=dbConnection();
                                        connection4.query(sql,(err,result)=>{
                                            if(!err){
                                                console.log('Negocio guardado con exite e investigacion nueva registrada',result);
                                                res.status(200).send({result});
                                            }else res.status(500).send({message:`Error al hacer la consulta en la base de datos ${err}`});
                                            connection4.destroy();
                                        });
                                    }else res.status(500).send({message:`Error al hacer la consulta en la base de datos ${err}`});
                                    connection3.destroy();
                                });
                            }
                        }else res.status(500).send({message:`Error al hacer la consulta en la base de datos ${err}`});
                        connection2.destroy();
                    }); 
                }else res.status(500).send({message:`Error al hacer la consulta en la base de datos ${err}`});
                connection1.destroy();
            });
            
            //res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
            //res.status(200).send({result:`negocio guardada`});
        }else res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        connection.destroy();
    });
}

function updateNegocio(req,res){
    var idnegocio = req.params.id;
    var data = req.body;
    if(!data.idcliente || !data.nombre_negocio || !data.callenum || !data.colonia || !data.estado || !data.municipio || !data.poblacion || !data.tipo_negocio || !data.giro_negocio || !data.idzona) return res.status(403).send({message:`No se enviaron todos los datos`})
    var connection = dbConnection();
    var sql = `UPDATE negocios SET  nombre_negocio='${data.nombre_negocio}', callenum='${data.callenum}', colonia='${data.colonia}',estado='${data.estado}',municipio='${data.municipio}',poblacion='${data.poblacion}', tipo_negocio='${data.tipo_negocio}',giro_negocio=${data.giro_negocio}, idzona=${data.idzona} WHERE idnegocio=${idnegocio}`;
    connection.query(sql,(err,result)=>{ 
        if(!err){
            res.status(200).send({result});
        }else res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        connection.destroy();
    });
}

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
    updateNegocio,
    uploadImageNegocio,
    updateImageNegocio
}