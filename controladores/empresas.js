const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


let getEmpresas=(req,res)=>{
    var connection = dbConnection();
    connection.query(`SELECT * FROM empresas `, (err, result, fields)=>{
        if(err)  res.status(500).send({message:`Error en la consulta ${err}`});
        if(result.length < 1)  res.status(404).send({message:`No se encontraron empresas`});
        if(!err && result.length >= 1){
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
        if(!result)  res.status(404).send({message:`No se encontro a la empresa`});
        if(!err && result){
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
        if(!result)  res.status(403).send({message: `Ha ocurrido un ERROR.... ${sql}`});
        if(!err && result){
            res.status(200).send({result:`Empresa guardada`});
        }
        connection.destroy();
    });
}


module.exports={
	getEmpresas,
	getEmpresa,
    addEmpresa
}