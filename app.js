var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var register = require('./routes/register');
var login = require('./routes/login');
var session = require('express-session');
var user = require('./lib/middleware/user');
var entries = require('./routes/entries');
var validate = require('./lib/middleware/validate');
var api = require('./routes/api');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session( { secret: 'nodejs',
				   saveUninitialized: true,
				   resave: true } ));
app.use(express.static(path.join(__dirname + 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(routes.error);
app.use(routes.notFound);
app.use(errorHandler());

app.get('/', entries.list);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/post', entries.form);
//app.post('/post', entries.submit);
app.post('/post', validate.required('entry[title]'), validate.lengthAbove('entry[title]', 4), entries.submit);

app.get('/api/user/:id', api.user);
app.get('/api/entries', api.entries);
app.post('/api/entry', entries.submit);

if(process.env.ERROR_ROUTE) {
	app.get('/dev/error', function(request, response, next) {
		console.dir(process.env.ERROR_ROUTE);
		var err = new Error('database connection failed');
		err.type = 'database';
		next(err);
	});
}

var server = http.createServer(app);

server.listen(app.get('port'), function() {
	console.log('Shoutbox Application Server listening on port: ' + app.get('port'));
	//console.log('All routes: ' + JSON.stringify(app._router.stack));
});