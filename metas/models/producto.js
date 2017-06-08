module.exports = function(sequelize, DataTypes) {
	var Producto = sequelize.define('productos', {
		descripcion: DataTypes.STRING
	});
	return Producto;
}