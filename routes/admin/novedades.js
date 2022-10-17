
var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/noveModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);// creado para destruir la img


//Listar novedades
router.get('/', async function (req, res, next) {

    var novedad = await novedadesModel.getNovedades();

    //mostramos imagen si la hay, si no, no mostramos nada
    novedad = novedad.map(novedad => {
        if (novedad.img_id) {
            const imagen = cloudinary.image(novedad.img_id, {
                width: 50,
                height: 50,
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


    res.render('admin/novedades', {
        layout: 'admin/layout',
        persona: req.session.nombre,
        novedad
    });
});


/* Para eliminar novedad */
router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;

    let novedad = await novedadesModel.getNovedadesById(id);//elimina la imagen 
    if (novedad.img_id) {
        await (destroy(novedad.img_id));
    }
    await novedadesModel.deleteNovedadesById(id);
    res.redirect('/admin/novedades')
});//cierra el get eliminar



/* Para agregar una novedad nueva */
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', { //agregar.hbs
        layout: 'admin/layout'
    });//cierra render
});//cierra get

router.post('/agregar', async (req, res, next) => {
    try {
        //
        var img_id = '';

        if (req.files && Object.keys(req.files).length > 0) {//si alguien agrego una imagen 
            imagen = req.files.imagen;//generamos variable que captura la imagen 
            img_id = (await uploader(imagen.tempFilePath)).public_id;//Se sube la imagen  al img_id
        }



        // console.log(req.body)
        if (req.body.titulo != "" && req.body.descripcion != "") {
            await novedadesModel.insertNovedad({
                ...req.body, //esto trae titulo, descripcion y lo que pasa en img_id
                img_id
            });
            res.redirect('/admin/novedades')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    } catch (error) {
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        })
    }
});


/*Modificar Novedades*/
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    var novedad = await novedadesModel.getNovedadesById(id);

    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    });
});

router.post('/modificar', async (req, res, next) => {
    try {
        let img_id = req.body.img_original;
        let borrar_img_vieja = false;

        if (req.body.img_delete === '1') {
            img_id = null;
            borrar_img_vieja = true;
        } else {
            if (req.files && Object.keys(req.files).length > 0) {
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }
        if (borrar_img_vieja && req.body.img_original) {
            await (destroy(req.body.img_original));//destruye la img de la base de datos y del servidor
        }

        var obj = {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            img_id
        }
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    }
    catch {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true, message: ' No se modifico la noverdad'
        })
    }
});


//



/* cierra  agregar una novedad nueva */
module.exports = router;