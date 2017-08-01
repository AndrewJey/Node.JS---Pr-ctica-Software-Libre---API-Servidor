module.exports = function (sequelize, DataTypes) {
  var Categoria = sequelize.define('categoria_clientes', {
    descripcion: DataTypes.STRING
  });

  Categoria.all = function () {
    return sequelize.query(
      "SELECT cc.descripcion , COUNT(*)::integer as cantidad_clientes " +
      "FROM categoria_clientes cc " +
      "INNER JOIN clientes c ON (c.categoria_cliente_id = cc.id) " +
      "GROUP BY cc.descripcion " +
      "ORDER BY cantidad_clientes DESC", { type: sequelize.QueryTypes.SELECT });
  };
  return Categoria;
}
