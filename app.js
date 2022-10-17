var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var session = require('express-session');
var fileUpload = require('express-fileupload');

//MANEJADOR DE RUTA

var indexRouter = require('./routes/index');//se encuentra en routes/index.js
var contactoRouter = require('./routes/contacto');//se encuentra en routes/contacto.js
var novedadesRouter = require('./routes/novedades');//se encuentra en routes/novedades.js
var portafolioRouter = require('./routes/portafolio');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/novedades');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//variable de session
app.use(session({
  secret:'ST4615lEuC2k4juPTp04',
  resave:false,
  saveUninitialized:true
}))

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if(req.session.id_usuario){
      next();
    }else{
      res.redirect('/admin/login')
    }
  } catch (error){
  console.log(error);
  }
}


//subida de archivos
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use('/', indexRouter);//Cuando recibo / llama al controlador
app.use('/contacto', contactoRouter);
app.use('/novedades', novedadesRouter);
app.use('/portafolio', portafolioRouter);
app.use('/admin/login',loginRouter);
app.use('/admin/novedades', secured, adminRouter );


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
