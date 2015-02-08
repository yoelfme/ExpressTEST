var express = require('express'),
	params = require('express-params'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

// Config params
params.extend(app);

// Set port
app.set('port',process.env.PORT || 3000);

// Set motor of views
app.set('views', __dirname + '/views');
app.set('view engine','jade');

// Middleware
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cookieParser());
app.use(session({ secret: 'esto es secreto', cookie: { maxAge: 60000 }}))

// Set public folder
app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res) {
	// res.send('Hola Express');
	res.render('index', {
		title_page: 'CHAT',
		title: 'Bienvenidos',
		username: 'Bienvenidos'
	});
});

// With parameters by GET
app.get('/users/:username',function(req, res) {
	var username = req.params.username;
	res.send('Hola ' + username);
});

// With parameters by POST
app.post('/users',function(req, res) {
	var username = req.body.username;
	res.send('Hola ' + username);
});

// Get browser
app.get('/browser',function(req, res) {
	res.send(req.get('user-agent'));
});

// 403
app.get('/not',function(req, res) {
	res.send(403,'prohibido el acceso');
});

// JSON
app.get('/json',function(req, res) {
	res.json({
		message: 'Hola'
	});
});

// Image
app.get('/image', function(req, res) {
	res.type('image/png').send('Esto es una imagen');
});

// Format
app.get('/format', function(req, res) {
	res.format({
		html: function(){
			res.send('<h1>Te he redireccionado</h1>');
		},
		json: function(){
			res.json({
				message: 'Hola'
			});
		},
		text: function(){
			res.send('Hola');
		}
	})
});

// Redirect
app.get('/redirect',function(req, res) {
	res.redirect('/format');
});

// With regular expresions
app.get(/\/personal\/(\d*)\/?(edit)?/,function(req, res) {
	var message = 'el perfil del usuario #' + req.params[0];

	if (req.params[1]=== 'edit') {
		message = 'Editando ' + message;
	}else {
		message = 'Viendo ' + message;
	};

	res.send(message);
});

// Routes advanced
var authors = ["Yoel","Fransua","Victor","Francisco"];

// Middleware
app.param('from', Number);
app.param('to', Number);

app.get('/authors/:from-:to',function(req, res) {
	console.log(typeof req.params.from);	
	res.json(authors.slice(req.params.from, req.params.to + 1));
});

// Static files
var count = 0;
app.get('/download.txt',function(req, res, next) {
	count+=1;
	next();
});

app.get('/count', function(req, res) {
	res.send("" + count + " descargas");
})

// Overload routes
function userAtIndex(req, res, next) {
	req.author = authors[parseInt(req.params.authorId,10)];
	next();
}

app.get('/overload/:authorId',userAtIndex, function(req, res) {
	res.json([req.author]);	
})

// Test cookies
app.get('/cookie/:name',function(req, res) {	
	res.cookie('name',req.params.name, {expires: new Date(Date.now()+ 900000)})
	res.send('<p> Vea el valor de la cookie <a href="/name">aqui</a> </p>');
});

app.get('/getCookie', function(req, res) {
	res.send(req.cookies.name);
});

app.get('/resetCookie', function(req, res, next) {
	res.clearCookie('name');
	next();
});

// Test sessions
app.get('/session/:name',function(req, res) {
	req.session.name = req.params.name;

	res
		.send('<p>Vea el valor de esta sesion <a href="/getSession">aqui</a></p>')
});

app.get('/getSession',function(req, res){
	res.send('Valor: ' + req.session.name);
});

// Test modules
var myHealthComponent = require('./modules/HealthComponent.js')(10);

console.log('Your health is:' + myHealthComponent.health);

server.listen(app.get('port'),function() {
	console.log('Express server listening on port ' + app.get('port'));
});