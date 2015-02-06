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

http.createServer(app).listen(app.get('port'),function() {
	console.log('Express server listening on port ' + app.get('port'));
});