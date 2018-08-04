const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getZonas=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM zonas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
       if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getZona=(req,res)=>{
    var idzona = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM zonas WHERE idzona = ${idzona} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let addZona= (req,res)=>{
    var data = req.body;
    if(!data.nombre || !data.colonia || data.idsucursal==null || data.idempleado==null) return  res.status(403).send({message:`No se mandaron todos los campos`});
    var connection = dbConnection();
    var sql = `INSERT INTO zonas VALUES (null,'${data.nombre}','${data.colonia}',${data.idsucursal},${data.idempleado},'Activa') `;
    connection.query(sql,(err,result)=>{ 
        if(!err){
            res.status(200).send({result:`zona guardada`});
        }else res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        connection.destroy();
    });
}

function updateZona(req,res){
    var idZona = req.params.id;
    var data = req.body;
    if(!data.nombre || !data.colonia || !data.status || data.idsucursal==null || data.idempleado==null )return res.status(403).send({message:`No sen enviaron todos los datos`});
    var connection = dbConnection();
    var sql=`UPDATE zonas SET nombre='${data.nombre}', colonia = '${data.colonia}', idsucursal=${data.idsucursal}, idempleado=${data.idempleado} ,status ='${data.status}' WHERE idzona = '${idZona}'`;
    connection.query(sql,(err,result)=>{
        if(!err){
            res.status(200).send({result:`zona Actualizada`});
        }else  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        connection.destroy();
    });
}

// function addRutaCobrador(req,res){
//     var data=req.body;
//     console.log(data);
//     if(!data.idcobrador || !data.idruta) return res.status(403).send({message:'No se enviaron todos lo datos'});
//     var connection = dbConnection();
//     var sql = `INSERT INTO rutasXcobrador VALUES (null,${data.idcobrador},${data.idruta})`;
//     connection.query(sql,(err,result)=>{
//         if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
//         if(!err){
//             res.status(200).send({result:`rutaxcobrador actualizada`});
//         }
//         connection.destroy();
//     })
// }

// function getRutasCobrador(req,res){
//     var connection=dbConnection();
//     var sql=`
//     Select 
//     rutasXcobrador.idruta_xcobrador,
//     empleados.nombres as empleado_nombres,
//     empleados.app_pat as empleado_app_pat,
//     empleados.app_mat as empleado_app_mat,
//     rutas.nombre as ruta_nombre
//     FROM rutasXcobrador
//     INNER JOIN empleados on empleados.idempleado = rutasXcobrador.idcobrador
//     INNER JOIN rutas on rutas.idruta = rutasXcobrador.idruta
//     `;
//     connection.query(sql,(err,result)=>{
//        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
//        if(!err){
//             res.status(200).send({result:result});
//         }
//         connection.destroy();
//     })
// }

function getZonasDetalles(req,res){
    var sql=`
        select 
        zonas.idzona as zona_idzona,
        zonas.nombre as zona_nombre,
        zonas.colonia as zona_colonia,
        zonas.status as zona_status,
        sucursales.idsucursal as sucursal_idsucursal,
        sucursales.nombre as sucursal_nombre,
        empleados.idempleado as empleado_idempleado,
        empleados.nombres as empleado_nombre,
        empleados.app_pat as empleado_app_pat,
        empleados.app_mat as empleado_app_mat
        FROM zonas 
        INNER JOIN sucursales on zonas.idsucursal = sucursales.idsucursal    
        INNER JOIN empleados on empleados.idempleado = zonas.idempleado
    `;
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(!err){
            res.status(200).send({result});
        }else res.status(500).send({message:`Error en la base de datos: ${err}`});
        connection.destroy();
    })
}

module.exports={
	getZonas,
	getZona,
    addZona,
    updateZona,
    getZonasDetalles
}