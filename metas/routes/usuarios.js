var express = require('express');
var router = express.Router();
var models = require('../models');

var criteria = function(req) {
  return {where: {id: req.params.id}};
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.send('respond with a resource');
	models.usuarios.findAll().then(usuarios => {
		res.json({usuarios: usuarios});
	});  
});

router.get('/:id', function(req, res, next) {
  models.usuarios.findOne(criteria(req)).then(usuario => {
    res.json(usuario);
  });
});

router.post('/', function(req, res, next) {
  models.usuarios.create(req.body).then(usuario => {
    res.json(usuario);
  });
});

router.delete('/:id', function(req, res, next) {
  models.usuarios.destroy(criteria(req)).then(() => {
    res.json({status: 'ok'});
  });
});

router.put('/:id', function(req, res, next) {
  models.usuarios.update(
    req.body, /* set attributes' value */
    criteria(req) /* where criteria */
  ).then(usuario => {
    res.json(usuario); 
  });
});

module.exports = router;