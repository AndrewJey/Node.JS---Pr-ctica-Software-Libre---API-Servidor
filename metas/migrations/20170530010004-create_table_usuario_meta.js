'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
      return queryInterface.createTable('usuario_meta',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },        
        meta_id: {
          type: Sequelize.INTEGER,        
          references: {
            model: 'metas',
            key: 'id'
          },
          allowNull: false
        },         
        usuario_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'usuarios',
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
      return queryInterface.dropTable('usuario_meta');
    }
  };