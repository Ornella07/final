var express = require('express');
var router = express.Router();
var usuariomodels = require('./../../models/usuariomodels');


//diseño de login
router.get('/',function(req,res,next){
    res.render('admin/login',{
        layout:'admin/layout',
    });
});

/*Para destruir variables de session*/
router.get('/logout',function(req,res,next) {
    req.session.destroy(); //destruye
    res.render('admin/login', {
        layout: 'admin/layout'

    });
});


router.post('/', async (req,res,next) =>{
    try {
        console.log(req.body);
        var usuario = req.body.usuario;
        var password = req.body.password;

        var data = await usuariomodels.getUserAndPassword(usuario, password);
        
        if (data != undefined) {     
            req.session.id_usuario = data.id;   
            req.session.nombre = data.usuario; 
            res.redirect('/admin/novedades');
        }else{
            res.render('admin/login', {
                layout:'admin/layout',
                error:true
            });
            
        }
    } catch (error){
        console.log(error)
    }
})



  module.exports = router;