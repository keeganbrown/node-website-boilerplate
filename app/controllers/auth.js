"use strict";
var config = require('../../config.js'),
	express = require('express'),
	session = require('express-session'),
	passwordless = require('passwordless'),
	MongoStore = require('passwordless-mongostore'),
	MongoDBSessionStore = require('connect-mongodb-session')(session),
	bodyParser = require('body-parser'),
	mandrill = require('mandrill-api/mandrill'),
	mandrill_client = new mandrill.Mandrill(config.MANDRILL_KEY),
	restricted = require('./_restricted.js'),
	router = express.Router();


var users = config.AUTH.USERS,
	authRouteOptions = config.AUTH_OPTIONS,
	authRootRoute = ( route ) => { return authRouteOptions.AUTHROOT+route; },
	sessionStore = new MongoDBSessionStore({ 
        uri: config.MONGOSTORE,
        collection: 'userSessions'
    });

passwordless.init(new MongoStore( config.MONGOSTORE ));
passwordless.addDelivery(passwordlessTokenDelivery, {ttl: 3*60*1000});

function init ( app ) {
	app.use(bodyParser.urlencoded( { extended: false } ));

	app.use(session({
		resave: true,
		saveUninitialized: false,
		secret: config.SESSION_SECRET,
		cookie: {
			maxAge: 1000*60*60*24 // 24 hours 
		},
		store: sessionStore
    }));
	app.use(passwordless.sessionSupport());

	app.use(function(req, res, next) {
		console.log( 'PASSWORDLESS', req.session.passwordless );
	    app.locals.loggedInUser = (req.user);
	    next();
	});
}

// PASSWORDLESS ROUTES AND HELPERS
function passwordlessTokenDelivery (tokenToSend, uidToSend, recipient, callback) {
	console.log( tokenToSend, uidToSend, recipient );
	mandrill_client.messages.send({ 'message': {
		'text': 'Login Link: http://' 
            + config.HOSTNAME + authRouteOptions.AUTHROOT + authRouteOptions.TOKEN_HANDLER +'?token=' + tokenToSend + '&uid=' 
            + encodeURIComponent(uidToSend),
	    'subject': 'Edit website request',
	    'from_email': 'keegan@mindandcode.com',
	    'from_name': 'Mind and Code Server',
	    'to': [{
	            'email': recipient,
	            'name': recipient,
	            'type': 'to'
        }]
	}, 'async': true }, 
		(sendresult) => {
			console.log(sendresult);
			callback();
		}, 
		(error) => {
			console.log(error);
			callback(error);
		});
}
function passwordlessEmailToken (user, delivery, callback) {
	var _userid = users.reduce((prev, curr, index, arr) => {
		if (curr.email === user.toLowerCase()) {
			return curr.id;
		}
		return prev;
	}, null);
	console.log('Checking for: ', user, 'is: ' + _userid);
    callback(null, _userid);
}


// PASSWORDLESS ROUTES
/* GET login screen. */
router.get(
	authRouteOptions.LOGIN, 
	(req, res) => {
		console.log('login!');
		res.render('auth', { show: 'login' } );
	}
);

/* GET dashboard. */
router.get(
	authRouteOptions.DASHBOARD, 
	restricted(),
	(req, res) => {
		console.log('dashboard!');
		res.render('auth', { show: 'dashboard' } );
	}
);

/* GET logout. */
router.get(
	authRouteOptions.LOGOUT, 
	passwordless.logout(), 
	(req, res) => {
		res.render('auth', { show: 'loggedout' });
	}
);

/* GET token handler. */
router.get(
	authRouteOptions.TOKEN_HANDLER, 
	passwordless.acceptToken({ 
		successRedirect: authRootRoute( authRouteOptions.DASHBOARD ) 
	}) 
);

/* POST login details. */
router.post(
	authRouteOptions.SEND_TOKEN, 
    passwordless.requestToken(passwordlessEmailToken),
    (req, res) => {
        // success!
        console.log('Sent!');
        res.render('auth', { show: 'sendtoken' } );
	}
);


module.exports = {
	init: init,
	router: router
};