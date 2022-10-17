var express = require('express');
var router = express.Router();
var novedadesModel = require('../models/noveModel');
var cloudinary = require('cloudinary').v2;


/* GET para que traiga la vista. */
router.get('/', async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();
  novedades = novedades.splice(0, 5);

  //mostramos imagen si la hay, si no, no mostramos nada
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 100,
        crop: 'fill'
      });
      return {
        ...novedad, //titulo, descp
        imagen//imagen
      }
    } else {
      return {
        ...novedad,//si no se da la condicion. nos va a devolver, titulo y descripcion
        imgane: ''//nada
      }
    }
  });



  res.render('index', {
    novedades
  });
});

module.exports = router;
