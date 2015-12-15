var exec = require('child_process').exec,
	express = require('express'),
	mongoose = require('mongoose'),

	marked = require('marked'),
	moment = require('moment'),
	striptags = require('striptags'),	

	//bodyParser = require('body-parser'),
	logger = require('morgan'),
	ejs = require('ejs'),
	config = require('../config.js'),
	app = express();


process.on('message', function(m, socket) {
	if (m === 'exit') {
		process.exit();
	}
});	

mongoose.connect(config.MONGODB);
app.set('views', './app/views')
app.use(express.static('public'));
app.use(logger('combined'));

app.locals.markdown_to_html = marked;
app.locals.striptags = striptags;
app.locals.moment = moment;


exec('sudo ./tasks/setup-socket.sh presocket $USER', function (err, stdio, stderr) {		
	console.log("PRESOCKET", err, stdio, stderr);
	var server = app.listen(config.SOCKET, function (status) {
		exec('sudo ./tasks/setup-socket.sh postsocket $USER', function (err, stdio, stderr) {	
			console.log("POSTSOCKET", err, stdio, stderr);
	  		console.log('Example app listening at http://%s:%s', server.address())
		});
	});
});

if ( config.ENV === 'production' ) {
	app.enable('view cache');
}

//PJAX HANDLER
app.use(function(req, res, next) {
    res.locals.pjax = !!(req.headers['x-pjax']);
    next();
});

//CACHING HEADERS
if ( config.ENV === 'production' ) {
app.use(function(req, res, next) {
    res.setHeader("Cache-Control", "public, max-age="+(5*60)+"");
    next();
});
}

app.set('view engine', 'ejs');  

var AuthController = require('./controllers/auth.js');
AuthController.init(app);
app.use('/auth', AuthController.router);

var StaticController = require('./controllers/statics.js');
app.use('/', StaticController);

var PostsController = require('./controllers/posts.js');
app.use('/posts', PostsController);

app.use(function(req, res, next) {
	res.status(404).render('error');
});
