const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getRutas=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM rutas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
       if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getRuta=(req,res)=>{
    var idEmpresa = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM rutas WHERE idruta = ${idEmpresa} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let addRuta= (req,res)=>{
    var data = req.body;
    if(!data.nombre || !data.colonias) return  res.status(403).send({message:`No se mandaron todos los campos`});
    var connection = dbConnection();
    var sql = `INSERT INTO rutas VALUES (null,'${data.nombre}','${data.colonias}',${data.idsucursal},'Activa') `;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`ruta guardada`});
        }
        connection.destroy();
    });
}

function updateRuta(req,res){
    var idruta = req.params.id;
    var data = req.body;
    if(!data.nombre || !data.colonias || !data.status || !data.idsucursal)return res.status(403).send({message:`No sen enviaron todos los datos`});
    var connection = dbConnection();
    var sql=`UPDATE rutas SET nombre='${data.nombre}', colonias = '${data.colonias}', idsucursal=${data.idsucursal} ,status ='${data.status}' WHERE idruta = '${idruta}'`;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`ruta Actualizada`});
        }
        connection.destroy();
    });
}

function addRutaCobrador(req,res){
    var data=req.body;
    if(!data.idcobrador || !data.idruta) return res.status(403).send({message:'No se enviaron todos lo datos'});
    var connection = dbConnection();
    var sql = `INSERT INTO rutasXcobrador VALUES (null,${data.idcobrador},${data.idruta})`;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`rutaxcobrador actualizada`});
        }
        connection.destroy();
    })
}

function getRutasCobrador(req,res){
    var connection=dbConnection();
    var sql=`
    Select 
    rutasXcobrador.idruta_xcobrador,
    empleados.nombres as empleado_nombres,
    empleados.app_pat as empleado_app_pat,
    empleados.app_mat as empleado_app_mat,
    rutas.nombre as ruta_nombre
    FROM rutasXcobrador
    INNER JOIN empleados on empleados.idempleado = rutasXcobrador.idcobrador
    INNER JOIN rutas on rutas.idruta = rutasXcobrador.idruta
    `;
    connection.query(sql,(err,result)=>{
       if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
       if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

module.exports={
	getRutas,
	getRuta,
    addRuta,
    updateRuta,
    addRutaCobrador,
    getRutasCobrador
}