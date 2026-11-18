module.exports = function (sequelize, DataTypes) {
  var Categoria = sequelize.define('categoria_clientes', {
    descripcion: DataTypes.STRING
  });

  Categoria.all = function () {
    return sequelize.query(
      "SELECT cc.descripcion , COUNT(c.id)::integer as cantidad_clientes " +
      "FROM categoria_clientes cc " +
      "LEFT JOIN clientes c ON (c.categoria_cliente_id = cc.id) " +
      "GROUP BY cc.id, cc.descripcion " +
      "ORDER BY cantidad_clientes DESC, cc.id ASC", { type: require('sequelize').QueryTypes.SELECT });
  };
  return Categoria;
}
