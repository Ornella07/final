var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contacto');//view/contacto.hbs
});

router.post('/', async (req,res,next) => {
   
  var nombre = req.body.nombre;
  var email = req.body.email;
  var celular = req.body.celular;
  var asunto = req.body.asunto;
  var mensaje = req.body.mensaje;


  var obj = {
    to: 'orne@hotmail.com',
    subject: 'Se contacto desde la web',
    html: `${nombre} se contacto y quiere mas informacion a este correo : ${email}.
    <br>Ademas, hizo la siguiente consulta: ${mensaje}.<br>Su telefono es: ${celular}.<br> Aguarda una respuesta `
  }//cierra var Obj
  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user:process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })//Cierra transporter

  var info = await transporter.sendMail(obj);

  res.render('contacto', {
    message: 'Mensaje enviado correctamente',
  });
})//cierra peticion del POST



module.exports = router;
