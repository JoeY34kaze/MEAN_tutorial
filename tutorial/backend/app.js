var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//-----CORS
//nastavit mormo headerje. torej mormo mal manipulirat response
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");//vsaka domena lahko dostopa do nas
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");//samo pomen da ima request lahko te extra headerje. ni nujno da jih ima. ce ima kaksen header ki ni tle napisan bi biu access blokiran
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");//options mora bit ker implicitno se poslje z browserjem
    next();//posljemo naprej po sistemu
});

//-----------BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


app.use('/api',apiRouter);
app.use('/', indexRouter);



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
