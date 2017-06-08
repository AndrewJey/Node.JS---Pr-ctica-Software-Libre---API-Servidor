var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//DEL SISTEMA: (v.0.1) -auto-generados-
//var index = require('./routes/index');
//var users = require('./routes/users');

//PROPIOS: (v.1.1) -primeros en hacerse-
//var productos = require('./routes/productos');
//var clientes = require('./routes/clientes');
//var usuarios = require('./routes/usuarios');
//var metas = require('./routes/metas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Se requieren y se usan de una vez (v.3.1) -metas.ultima-
app.use('/', require('./routes'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/productos', require('./routes/productos'));
app.use('/api/v1/clientes', require('./routes/clientes'));
app.use('/api/v1/usuarios', require('./routes/usuarios'));
app.use('/api/v1/metas', require('./routes/metas'));
app.use('/api/v1/usuario_meta', require('./routes/usuario_meta'));
app.use('/api/v1/usuario_meta_valor', require('./routes/usuario_meta_valor'));

//DEL SISTEMA: (v.0) -auto-generados-
//app.use('/', index);
//app.use('/users', users);

//PROPIOS: (v.1.1) -primeros en hacerse-
//app.use('/productos', productos);
//app.use('/clientes', clientes);
//app.use('/usuarios', usuarios);
//app.use('/metas', metas);

//DEL PROFE (NOMENCLATURA OFICIAL): (v.2.0) -metas.metas-
//app.use('/api/v1', index);
//app.use('/api/v1/usuarios', usuarios);
//app.use('/api/v1/productos', productos);
//app.use('/api/v1/metas', metas);
//app.use('/api/v1/clientes', clientes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('NO ENCONTRADO: SE PERDIÓ');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;