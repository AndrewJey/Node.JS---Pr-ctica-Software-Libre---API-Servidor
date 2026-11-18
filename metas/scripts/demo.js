'use strict';
const models=require('../models');
(async()=>{
  try{
    await models.sequelize.authenticate();
    for(const descripcion of ['General','Frecuente'])await models.categoria_clientes.findOrCreate({where:{descripcion}});
    console.log('Categorías de demostración disponibles. No se eliminaron datos existentes.');
  }finally{await models.sequelize.close();}
})().catch(()=>{console.error('No se pudieron crear categorías. Configura DATABASE_URL y ejecuta db:migrate primero.');process.exitCode=1;});
