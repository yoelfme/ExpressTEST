var express = require('express'),
	http = require('http'),
	app = express(),
	bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));


// Set port
app.set('port',process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'),function() {
	console.log('Express server listening on port ' + app.get('port'));
});

app.get('/',function(req,res) {
	res.send('Hola Express');
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