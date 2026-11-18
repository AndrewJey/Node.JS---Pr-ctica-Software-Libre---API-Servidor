"use strict";
const fs = require('node:fs');
const path = require('node:path');
const {Sequelize, DataTypes} = require('sequelize');
if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en metas/.env antes de iniciar. Consulta RUNNING.md.');
const sequelize = new Sequelize(process.env.DATABASE_URL, {dialect: 'postgres', logging: false});
const db = {};
for (const file of fs.readdirSync(__dirname).sort()) {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  }
}
for (const model of Object.values(db)) if (model.associate) model.associate(db);
module.exports = {...db, sequelize, Sequelize};
