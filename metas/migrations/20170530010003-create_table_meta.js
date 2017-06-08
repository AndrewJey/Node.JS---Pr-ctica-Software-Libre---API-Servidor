'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
      return queryInterface.createTable('metas',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },        
        descripcion: {
          type: Sequelize.STRING,
          allowNull: false
        },
        valor_esperado: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        fecha_limite: {
          type: Sequelize.DATE,
          allowNull: false
        },
        producto_id: {
          type: Sequelize.INTEGER,        
          references: {
            model: 'productos',
            key: 'id'
          },
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }  
      });
    },

    down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
      */
      return queryInterface.dropTable('metas');
    }
  };
