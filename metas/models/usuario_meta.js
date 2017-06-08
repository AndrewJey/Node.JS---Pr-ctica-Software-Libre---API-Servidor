module.exports = function(sequelize, DataTypes) {
	var Usuario_meta = sequelize.define('usuario_meta', {
		meta_id: DataTypes.INTEGER,
		usuario_id: DataTypes.INTEGER
	});
	return Usuario_meta;
}