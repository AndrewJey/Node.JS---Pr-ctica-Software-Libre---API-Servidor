var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.metas.findAll().then(metas => {
    res.json({metas: metas});
  });
});

module.exports = router;
