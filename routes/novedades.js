var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('novedades');
});

router.get('/modificar/:id', async (req, res, next) =>{
  let id = req.params.id;
  let novedad = await noveModel.getNovedadesById(id);
  res.render('admin/modificar',{
    layout: 'admin/layout',
    novedad
  });
});
module.exports = router;
