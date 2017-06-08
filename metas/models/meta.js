module.exports = function(sequelize, DataTypes) {
	var Meta = sequelize.define('metas', {
		descripcion: DataTypes.STRING,
		valor_esperado: DataTypes.INTEGER,
		fecha_limite: DataTypes.DATE,
		producto_id: DataTypes.INTEGER
	});
	return Meta;
}