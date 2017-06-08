var express = require('express');
var router = express.Router();
var models = require('../models');

var criteria = function(req) {
  return {where: {id: req.params.id}};
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.metas.findAll().then(metas => {
    res.json({metas: metas});
  });
});

router.get('/:id', function(req, res, next) {
  models.metas.findOne(criteria(req)).then(meta => {
    res.json(meta);
  });
});

router.post('/', function(req, res, next) {
  models.metas.create(req.body).then(meta => {
    res.json(meta);
  });
});

router.delete('/:id', function(req, res, next) {
  models.metas.destroy(criteria(req)).then(() => {
    res.json({status: 'ok'});
  });
});

router.put('/:id', function(req, res, next) {
  models.metas.update(
    req.body, /* set attributes' value */
    criteria(req) /* where criteria */
  ).then(meta => {
    res.json(meta); 
  });
});

module.exports = router;