var express = require('express'),
	http = require('http'),
	app = express(),
	bodyParser = require('body-parser');

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

app.use(express.static(__dirname + 'public'));

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
app.format('/format', function(req, res) {
	res.format({
		html: function(){
			res.send('<h1>Hola</h1>');
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

http.createServer(app).listen(app.get('port'),function() {
	console.log('Express server listening on port ' + app.get('port'));
});