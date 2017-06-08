var express = require('express');
var router = express.Router();
var models = require('../models');

var criteria = function(req) {
  return {where: {id: req.params.id}};
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.send('respond with a resource');
	models.productos.findAll().then(productos => {
		res.json({productos: productos});
	});  
});

router.get('/:id', function(req, res, next) {
  models.productos.findOne(criteria(req)).then(producto => {
    res.json(producto);
  });
});

router.post('/', function(req, res, next) {
  models.productos.create(req.body).then(producto => {
    res.json(producto);
  });
});

router.delete('/:id', function(req, res, next) {
  models.productos.destroy(criteria(req)).then(() => {
    res.json({status: 'ok'});
  });
});

router.put('/:id', function(req, res, next) {
  models.productos.update(
    req.body, /* set attributes' value */
    criteria(req) /* where criteria */
  ).then(producto => {
    res.json(producto); 
  });
});

module.exports = router;