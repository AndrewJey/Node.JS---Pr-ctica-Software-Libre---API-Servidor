'use strict';
module.exports={
  // La migración anterior ya creó la tabla. Renombrar y ampliar conserva sus filas.
  up:async(queryInterface,Sequelize)=>queryInterface.sequelize.transaction(async transaction=>{
    const columns=await queryInterface.describeTable('usuario_meta_valor',{transaction});
    if(columns.um_id && columns.usuario_meta_id) throw new Error('Existen ambas columnas de referencia; revisar los datos antes de migrar.');
    if(columns.um_id) await queryInterface.renameColumn('usuario_meta_valor','um_id','usuario_meta_id',{transaction});
    await queryInterface.changeColumn('usuario_meta_valor','valor',{type:Sequelize.DOUBLE,allowNull:false},{transaction});
  }),
  down:async(queryInterface,Sequelize)=>queryInterface.sequelize.transaction(async transaction=>{
    const [rows]=await queryInterface.sequelize.query('SELECT 1 FROM usuario_meta_valor WHERE valor <> trunc(valor) OR valor < -2147483648 OR valor > 2147483647 LIMIT 1',{transaction});
    if(rows.length) throw new Error('El rollback perdería valores decimales o fuera de rango.');
    await queryInterface.changeColumn('usuario_meta_valor','valor',{type:Sequelize.INTEGER,allowNull:false},{transaction});
    await queryInterface.renameColumn('usuario_meta_valor','usuario_meta_id','um_id',{transaction});
  })
};
