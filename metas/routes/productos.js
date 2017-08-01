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
      models.productos.findAll().then(productos => {
        res.json({productos: productos});
      });
    },
    html: function () {
      models.productos.findAll().then(productos => {
        res.render('productos/index_ajax', { productos: productos });
      });
    }
  });
});

router.get('/new', function(req, res, next) {
  res.render('productos/new');
});

router.get('/:id', function(req, res, next) {
  var producto = models.productos.findOne(criteria(req));
  res.format({
    json: function() {
      producto.then(producto => {
        res.json(producto);
      });
    },
    html: function () {
      producto.then(producto => {
        res.render('productos/edit', { producto: producto });   
      });
    }
  })
  
});

router.post('/', function(req, res, next) {
  if(req.files){
    var picture = req.files.picture;
    req.body.picture = '/images/' + picture.name;
  }
  var producto = models.productos.create(req.body);
  res.format({
    json: function () {
      producto.then(producto => {
        res.json(producto);
      });
    },
    html: function () {
      picture.mv('public/images/' + picture.name, function(err) {
        if (err)
          return res.status(500).send(err);
        producto.then(producto => {
          res.redirect('/api/v1/products');
        });  
      });
    }
  })
});

router.delete('/:id', function(req, res, next) {
  res.format({
    json: function() {
      models.productos.destroy(criteria(req)).then(() => {
        res.json({status: 'ok'});
      });
    },
    html: function () {
      models.productos.destroy(criteria(req)).then(() => {
        res.redirect('/api/v1/products');
      });
    }
  });
});

router.put('/:id', function(req, res, next) {
  res.format({
    json: function () {
      models.productos.update(req.body, criteria(req)).then(producto => {
        res.json(producto);
      });
    },
    html: function () {
      models.productos.update(req.body, criteria(req)).then(producto => {
        res.redirect('/api/v1/products');
      });
    }
  });
});


module.exports = router;
