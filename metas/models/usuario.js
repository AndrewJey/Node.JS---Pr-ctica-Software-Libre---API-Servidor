module.exports = function(sequelize, DataTypes) {
	var Usuario = sequelize.define('usuarios', {
		nombre: DataTypes.STRING,
		email: DataTypes.STRING,
		clave: DataTypes.STRING
	});
	return Usuario;
}