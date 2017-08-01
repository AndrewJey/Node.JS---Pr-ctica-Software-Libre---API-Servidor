module.exports = function(sequelize, DataTypes) {
	var Cliente = sequelize.define('clientes', {
		nombre: DataTypes.STRING,
		email: DataTypes.STRING,
		telefono: DataTypes.STRING,
    categoria_cliente_id: DataTypes.INTEGER
	});
  Cliente.all = function () {
    return sequelize.query(
      "select c.*, cc.descripcion " +
      "from clientes c " +
      "left join categoria_clientes cc on (c.categoria_cliente_id = cc.id)", { type: sequelize.QueryTypes.SELECT});
  };

  return Cliente;

};

