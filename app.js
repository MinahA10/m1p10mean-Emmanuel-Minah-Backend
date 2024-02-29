var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const cors = require('cors');
const session = require('express-session');

//Services
//Services
const { connectDB } = require('./services/mongoose')
connectDB();
// Fonction
const fonction = require('./models/fonction');


//Api clients
var indexRouterGuest = require('./routes/guest/index');
var indexRouterAuth = require('./routes/auth/index');
var authClientRoute = require('./routes/client/authClient');

//routes
var indexRouterGuest = require('./routes/guest/index');
var indexRouterAuth = require('./routes/auth');
var authClientRoute = require('./routes/client/authClient');
var appointmentRoute = require('./routes/client/appointmentRoute');
var serviceRoute = require('./routes/client/serviceRoute');
var employeRoute = require('./routes/client/employeRoute');

//routes
var indexRouterGuest = require('./routes/guest/index');
var indexRouterAuth = require('./routes/auth/index');

var app = express();

// view engine setup
app.engine('handlebars', exphbs.engine({
  defaultLayout: "guest", 
  layoutsDir: "./views/layouts/",
  extname: "handlebars",
  helpers: {
    formatMillier: function(args){
      return fonction.formatMillier(args);
    },
    formaterNumeroTelephone: function(args){
      return fonction.formaterNumeroTelephone('+261'+args);
    },
    getContact: function(args, index){
      let contact = fonction.getContact(args, index);
      return fonction.formaterNumeroTelephone('+261'+contact);
    },
    getSimpleContact: function(args, index){
      return fonction.getContact(args, index);
    },
    formatDate: function(args){
      return fonction.formatDate(args.toISOString());
    },
    formatHeure: function(args){
      return fonction.formatHeure(args.toISOString());
    },
    isEqual: function(value1, value2, options) {
        return value1 === value2 ? options.fn(this) : options.inverse(this);
    },
    isNotEqual: function(value1, value2, options) {
        return value1 === value2 ? options.inverse(this) : options.fn(this);
    },
    formatTimeWithoutSecond: function(args){
      return fonction.formatTimeWithoutSecond(args);
    },
    convertArray: function(args){
      return JSON.stringify(args);
    }
  }
}));

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth/css', express.static(__dirname + '/public/css'));
app.use('/auth/js', express.static(__dirname + '/public/js'));
app.use('/auth/images', express.static(__dirname + '/public/images'));
app.use('/auth/parametre/css', express.static(__dirname + '/public/css'));
app.use('/auth/parametre/js', express.static(__dirname + '/public/js'));
app.use('/auth/parametre/images', express.static(__dirname + '/public/images'));
app.use(cors(corsOptions));


app.use(session({
  secret: 'm1p11mean-Emmanuel-Minah-Backend',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Si true, le cookie ne sera transmis que sur une connexion HTTPS
    httpOnly: true, // Empêche l'accès au cookie via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie en millisecondes
  }
}));

// Middleware pour ajouter les variables de session à res.locals
app.use((req, res, next) => {
  // Vérifie si des variables de session sont définies
  if (req.session && req.session.user) {
    // Ajoute les variables de session à res.locals
    res.locals.user = req.session.user;
  }
  next();
});

app.options('api/auth/login', cors());
app.use('/', indexRouterGuest);
app.use('/auth', indexRouterAuth);

//client api
app.use('/api/auth',authClientRoute);
app.use('/api/appointment',appointmentRoute);
app.use('/api/service',serviceRoute);
app.use('/api/employe',employeRoute);


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
  res.render('pages/error/error-500', {layout: "error"});
});

module.exports = app;
