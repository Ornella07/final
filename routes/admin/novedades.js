var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/noveModel');


router.get('/', async function(req,res,next){

    var novedad = await novedadesModel.getNovedades(); 
       res.render('admin/novedades',{
        layout: 'admin/layout',
        persona: req.session.nombre,
        novedad
    });
});


/* Para eliminar novedad */
router.get('/eliminar/:id', async (req, res, next) =>{
    var id =req.params.id;
    await novedadesModel.deleteNovedadesById(id);
    res.redirect('/admin/novedades')
});//cierra el get eliminar




/* Para agregar una novedad nueva */
router.get('/agregar',(req,res,next)=>{
    res.render('admin/agregar',{ //agregar.hbs
        layout:'admin/layout'
    });//cierra render
});//cierra get

router.post('/agregar', async (req, res, next)=>{
    try{
       // console.log(req.body)
        if(req.body.titulo != "" && req.body.descripcion != "" ){
            await novedadesModel.insertNovedad(req.body);
            res.redirect('/admin/novedades')
        }else{
            res.render('admin/agregar',{
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    }catch (error){
            res.render('admin/agregar',{
            layout:'admin/layout',
            error:true,
            message: 'No se cargo la novedad'
        })
    }
});


/*Modificar Novedades*/
router.get('/modificar/:id', async (req, res, next) =>{
    var id = req.params.id;
    var novedad = await novedadesModel.getNovedadesById(id);

    res.render('admin/modificar',{
      layout: 'admin/layout',
      novedad
    });
  });

router.post('/modificar', async (req,res,next)=>{
    try{
        let obj = {
            titulo: req.body.titulo,
            descripcion:req.body.descripcion
        }
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    }
    catch{ 
        console.log(error)
        res.render('admin/modificar',{
            layout: 'admin/layout',
             error: true, message:' No se modifico la noverdad'
        })
    }
})




/* cierra  agregar una novedad nueva */
module.exports = router;