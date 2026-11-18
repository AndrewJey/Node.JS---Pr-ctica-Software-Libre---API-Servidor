'use strict';
const express = require('express');
const path = require('node:path');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const models = require('./models');
const {HttpError, wantsJSON} = require('./lib/http');
const {uploadDir} = require('./lib/uploads');
const app = express();
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (process.env.NODE_ENV !== 'test') app.use(logger('tiny'));
app.use((req, res, next) => {res.set('X-Content-Type-Options', 'nosniff'); next();});
app.use(express.json({limit:'128kb'}));
app.use(express.urlencoded({extended:false, limit:'128kb'}));
app.use(fileUpload({limits:{fileSize:5 * 1024 * 1024, files:1}, abortOnLimit:true,
  limitHandler:(req,res,next) => next(new HttpError(413, 'La imagen supera el límite permitido.'))}));
app.use(methodOverride('_method'));
app.use('/images/uploads', express.static(uploadDir, {fallthrough:true, index:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/productos'));
app.use('/api/v1/clients', require('./routes/clientes'));
app.use('/metas', require('./routes/metas'));
app.get('/health', async (req,res) => {await models.sequelize.authenticate(); res.json({status:'ok'});});
app.use((req,res,next) => next(new HttpError(404, 'La página o recurso no existe.')));
app.use((error,req,res,next) => {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.status && error.status < 500 ? error.message : 'No se pudo completar la operación.';
  if (error.name === 'SequelizeValidationError') {status=400;message='Revisa los datos enviados.';}
  if (error.name === 'SequelizeForeignKeyConstraintError') {status=409;message='El registro está relacionado con otros datos. Revisa sus referencias.';}
  if (error.name === 'SequelizeUniqueConstraintError') {status=409;message='Ya existe un registro con esos datos.';}
  if (error.name?.startsWith('SequelizeConnection')) {status=503;message='No se pudo conectar a la base de desarrollo. Revisa DATABASE_URL.';}
  res.status(status);
  if (wantsJSON(req)) return res.json({error:message});
  res.render('error',{message,error:{status}});
});
module.exports = app;
