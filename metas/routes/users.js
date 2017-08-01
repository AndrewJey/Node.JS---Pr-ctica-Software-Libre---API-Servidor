var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/favorite', function(req, res, next) {
  res.json({name: "carlos", email: "crojas@utn.ac.cr", phone: "asdqw"});
});

module.exports = router;
