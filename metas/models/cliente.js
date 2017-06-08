module.exports = function(sequelize, DataTypes) {
	var Cliente = sequelize.define('clientes', {
		nombre: DataTypes.STRING,
		email: DataTypes.STRING,
		telefono: DataTypes.STRING
	});
	return Cliente;
}