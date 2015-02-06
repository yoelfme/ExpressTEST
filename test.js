var express = require('express'),
	params = require('express-params'),
	http = require('http'),
	app = express(),
	bodyParser = require('body-parser');

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

http.createServer(app).listen(app.get('port'),function() {
	console.log('Express server listening on port ' + app.get('port'));
});