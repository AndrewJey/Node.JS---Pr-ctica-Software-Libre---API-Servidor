'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
      return queryInterface.createTable('usuario_meta_valor',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },

        usuario_meta_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'usuario_meta',
            key: 'id'
          },
          allowNull: false
        },
        cliente_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'clientes',
            key: 'id'
          },
          allowNull: false
        },
        valor: {
          type: Sequelize.DOUBLE,
          allowNull: false
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
      return queryInterface.dropTable('usuario_meta_valor');
    }
  };
