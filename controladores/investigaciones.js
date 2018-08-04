var config = require('../config');
var dbConnection = config.connection;
const moment = require('moment');

function  updateInvestigaciones(req,res){
    var data = req.body;
    console.log(data);
    var idinvestigacion = req.params.id;
    var fecha_investigacion = moment().format('YYYY-MM-DD')
    var sql = `
        UPDATE investigaciones SET 
        fecha_investigacion = '${fecha_investigacion}',
        zona = '${data.zona}',
        cobrador_zona = '${data.cobrador_zona}',
        telefonos = '${data.telefonos}',
        nombre_completo = '${data.nombre_completo}',
        fecha_nacimiento = '${data.fecha_nacimiento}',
        edad = '${data.edad}',
        estado_civil = '${data.estado_civil}',
        direccion_hogar = '${data.direccion_hogar}',
        hogar_propio_orentado = '${data.hogar_propio_orentado}',
        numero_dependientes_economicos = '${data.numero_dependientes_economicos}',
        monto_credito = '${data.monto_credito}',
        tipo_comprobante = '${data.tipo_comprobante}',
        direccion_negocio = '${data.direccion_negocio}',
        horario = '${data.horario}',
        propietario_oempleado = '${data.propietario_oempleado}',
        local_oambulante = '${data.local_oambulante}',
        negocio_propio_orentado = '${data.negocio_propio_orentado}',
        contrato_arrendamiento = '${data.contrato_arrendamiento}',
        nombre_aval = '${data.nombre_aval}',
        tiempo_conocerse = '${data.tiempo_conocerse}',
        telefono_aval = '${data.telefono_aval}',
        nombre_familiar = '${data.nombre_familiar}',
        telefono_familiar = '${data.telefono_familiar}',
        parentezco_familiar = '${data.parentezco_familiar}',
        como_supo = '${data.como_supo}'
        WHERE idinvestigacion = ${idinvestigacion}
    `;
    console.log(sql);
    var connection = dbConnection();
    connection.query(sql,(err,result)=>{
        if(!err){
            console.log('Investigacion crediticia guardada con exito');
            res.status(200).send(result);
        }else res.status(500).send({messaje:`Error al hacer la consulta en la bd  ${err}`});
        connection.destroy();
    });
}

function getInvestigaciones(res,res){
    var connection = dbConnection();
    connection.query('SELECT * FROM investigaciones', (err,result)=>{
        if(!err){
            res.status(200).send(result);
        }else res.status(500).send({messaje:`Error al consultar la bd ${err}`});
        connection.destroy();
    });
}

module.exports={
    updateInvestigaciones,
    getInvestigaciones
}