module.exports = function(sequelize, DataTypes) {
	var Usuario_meta = sequelize.define('usuario_meta', {
		meta_id: DataTypes.INTEGER,
		usuario_id: DataTypes.INTEGER
	}, {tableName: 'usuario_meta'});
	return Usuario_meta;
}