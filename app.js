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