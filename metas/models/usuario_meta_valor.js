module.exports = function (sequelize, DataTypes) {
	var Usuario_meta_valor = sequelize.define('usuario_meta_valor', {
		usuario_meta_id: DataTypes.INTEGER,
		cliente_id: DataTypes.INTEGER,
		valor: DataTypes.DOUBLE
	},{
		tableName: 'usuario_meta_valor'
	});
	return Usuario_meta_valor;
}