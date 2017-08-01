'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('clientes',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
       nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
       email: {
        type: Sequelize.STRING,
        allowNull: false
      },
       telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoria_cliente_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categoria_clientes',
          key: 'id'
        },
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
         return queryInterface.dropTable('clientes');
  }
};
