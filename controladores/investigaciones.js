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
            res.status(200).send({result});
        }else res.status(500).send({messaje:`Error al hacer la consulta en la bd  ${err}`});
        connection.destroy();
    });
}

function getInvestigaciones(res,res){
    var connection = dbConnection();
    connection.query('SELECT * FROM investigaciones', (err,result)=>{
        if(!err){
            res.status(200).send({result});
        }else res.status(500).send({messaje:`Error al consultar la bd ${err}`});
        connection.destroy();
    });
}

function getInvestigacionesDetalles(res,res){
    var connection = dbConnection();
    var sql = `
        SELECT 
        /*datos de investigaciones*/
        investigaciones.idinvestigacion as investigacion_idinvestigacion,
        investigaciones.fecha_investigacion as investigacion_fecha_investigacion,
        investigaciones.telefonos as investigacion_telefonos,
        investigaciones.idcliente as investigacion_idcliente,
        investigaciones.nombre_completo as investigacion_nombre_completo,
        investigaciones.fecha_nacimiento as investigacion_fecha_nacimiento,
        investigaciones.edad as investigacion_edad,
        investigaciones.estado_civil as investigacion_estado_civil,
        investigaciones.direccion_hogar as investigacion_direccion_hogar,
        investigaciones.hogar_propio_orentado as investigacion_hogar_propio_orentado,
        investigaciones.numero_dependientes_economicos as investigacion_numero_dependientes_economicos,
        investigaciones.monto_credito as investigacion_monto_credito,
        investigaciones.tipo_comprobante as investigacion_tipo_comprobante,
        investigaciones.direccion_negocio as investigacion_direccion_negocio,
        investigaciones.horario as investigacion_horario,
        investigaciones.propietario_oempleado as investigacion_propietario_oempleado,
        investigaciones.local_oambulante as investigacion_local_oambulante,
        investigaciones.negocio_propio_orentado as investigacion_negocio_propio_orentado,
        investigaciones.contrato_arrendamiento as investigacion_contrato_arrendamiento,
        investigaciones.nombre_aval as investigacion_nombre_aval,
        investigaciones.tiempo_conocerse as investigacion_tiempo_conocerse,
        investigaciones.telefono_aval as investigacion_telefono_aval,
        investigaciones.nombre_familiar as investigacion_nombre_familiar,
        investigaciones.telefono_familiar as investigacion_telefono_familiar,
        investigaciones.parentezco_familiar as investigacion_parentezco_familiar,
        investigaciones.como_supo as investigacion_como_supo,
        /*datos de zonas*/
        zonas.idzona as zona_idzona,
        zonas.nombre as zona_nombre,
        /*datos del cobrador*/
        empleados.idempleado as empleado_idempleado,
        empleados.nombres as empleado_nombres,
        empleados.app_pat as empleado_app_pat,
        empleados.app_mat as empleado_app_mat
        FROM investigaciones
        INNER JOIN zonas on investigaciones.zona = zonas.idzona
        INNER JOIN empleados on investigaciones.cobrador_zona = empleados.idempleado
    `;
    connection.query(sql, (err,result)=>{
        if(!err){
            res.status(200).send({result});
        }else res.status(500).send({messaje:`Error al consultar la bd ${err}`});
        connection.destroy();
    });
}

module.exports={
    updateInvestigaciones,
    getInvestigaciones,
    getInvestigacionesDetalles
}