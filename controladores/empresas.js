const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getEmpresas=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM empresas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
       if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let getEmpresa=(req,res)=>{
    var idEmpresa = req.params.id;
    var connection = dbConnection();
    connection.query(`SELECT * FROM empresas WHERE idEmpresa = ${idEmpresa} `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(!err){
            res.status(200).send({result:result});
        }
        connection.destroy();
    })
}

let addEmpresa= (req,res)=>{
    var data = req.body;
    if(!data.razon_social || !data.direccion || !data.descripcion) return  res.status(403).send({message:`No se mandaron todos los campos`});
    var connection = dbConnection();
    var sql = `INSERT INTO empresas VALUES (null,'${data.razon_social}','${data.direccion}','${data.descripcion}') `;
    connection.query(sql,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`Empresa guardada`});
        }
        connection.destroy();
    });
}

function updateEmpresa(req,res){
    var idEmpresa = req.params.id;
    var data = req.body;
    if(!data.razon_social || !data.direccion || !data.descripcion)return res.status(403).send({message:`No sen enviaron todos los datos`});
    var connection = dbConnection();
    connection.query(`UPDATE empresas set razon_social='${data.razon_social}', direccion = '${data.direccion}', descripcion ='${data.descripcion}' WHERE idempresa = ${idEmpresa}`,(err,result)=>{
        if(err)  res.status(500).send({message:`Error al hacer la consulta a la base de datos ${err} SQL= ${sql}`});
        if(!err){
            res.status(200).send({result:`Empresa Actualizada`});
        }
        connection.destroy();
    });
}

module.exports={
	getEmpresas,
	getEmpresa,
    addEmpresa,
    updateEmpresa
}