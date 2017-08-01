var express = require('express');
var router = express.Router();
var models = require('../models');


var criteria = function(req) {
  return { where: {id: req.params.id} };
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.format({
    json: function () {
      models.clientes.findAll().then(clientes => {
        res.json({clientes: clientes});
      });
    },
    html: function () {
      models.clientes.all().then(clientes => {
        res.render('clientes/index', { clientes: clientes });
      });
    }
  });
});

router.get('/new', function(req, res, next) {
  models.categoria_clientes.findAll().then(categorias => {
    res.render('clientes/new', {categorias: categorias});
  });
});

router.get('/categorias', function(req, res, next) {
  res.format({
    json: function () {
      models.categoria_clientes.all().then(categorias => {
        var resultado = [];
        categorias.forEach(function(categoria) {
          resultado.push([categoria.descripcion, categoria.cantidad_clientes]);
        });
        res.json(resultado);      
      });
    },
    html: function() {
      models.categoria_clientes.all().then(categorias => {
        res.render('clientes/categorias', {categorias: categorias});
      });
    }
  });
});


router.get('/:id', function(req, res, next) {
  var cliente = models.clientes.findOne(criteria(req));
  var categorias = models.categoria_clientes.findAll();
  res.format({
    json: function() {
      cliente.then(cliente => {
        res.json(cliente);
      });
    },
    html: function () {
      Promise.all([cliente, categorias]).then(values => {
        res.render('clientes/edit', { cliente: values[0], 
                                      categorias: values[1]});   
      })
    }
  })
  
});

router.post('/', function(req, res, next) {
  var cliente = models.clientes.create(req.body);
  res.format({
    json: function () {
      cliente.then(cliente => {
        res.json(cliente);
      });
    },
    html: function () {
      cliente.then(cliente => {
        res.redirect('/api/v1/clients');
      });
    }
  })
});

router.delete('/:id', function(req, res, next) {
  res.format({
    json: function() {
      models.clientes.destroy(criteria(req)).then(() => {
        res.json({status: 'ok'});
      });
    },
    html: function () {
      models.clientes.destroy(criteria(req)).then(() => {
        res.redirect('/api/v1/clients');
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  res.format({
    json: function () {
      models.clientes.update(req.body, criteria(req)).then(cliente => {
        res.json(cliente);
      });
    },
    html: function () {
      models.clientes.update(req.body, criteria(req)).then(cliente => {
        res.redirect('/api/v1/clients');
      });
    }
  });
});


module.exports = router;
