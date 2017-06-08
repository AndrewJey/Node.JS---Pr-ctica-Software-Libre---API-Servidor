var express = require('express');
var router = express.Router();
var models = require('../models');

var criteria = function(req) {
  return {where: {id: req.params.id}};
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.send('respond with a resource');
	models.clientes.findAll().then(clientes => {
		res.json({clientes: clientes});
	});  
});

router.get('/:id', function(req, res, next) {
  models.clientes.findOne(criteria(req)).then(cliente => {
    res.json(cliente);
  });
});

router.post('/', function(req, res, next) {
  models.clientes.create(req.body).then(cliente => {
    res.json(cliente);
  });
});

router.delete('/:id', function(req, res, next) {
  models.clientes.destroy(criteria(req)).then(() => {
    res.json({status: 'ok'});
  });
});

router.put('/:id', function(req, res, next) {
  models.clientes.update(
    req.body, /* set attributes' value */
    criteria(req) /* where criteria */
  ).then(cliente => {
    res.json(cliente); 
  });
});

module.exports = router;