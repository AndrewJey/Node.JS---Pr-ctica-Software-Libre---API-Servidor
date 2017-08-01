module.exports = function(sequelize, DataTypes) {
	var Producto = sequelize.define('productos', {
		descripcion: DataTypes.STRING,
    picture: DataTypes.STRING
	});
	return Producto;
}
