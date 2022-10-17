var express = require('express');
var router = express.Router();
var novedadesModel = require('../models/noveModel');


/* GET para que traiga la vista. */
router.get('/', async function(req, res, next) {
  var novedades = await novedadesModel.getNovedades();

  res.render('index',{
    novedades
  });
});

module.exports = router;
