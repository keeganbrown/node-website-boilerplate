var util = require('util'),
	fs = require('fs'),
	extend = require('deep-extend');


var CONFIG = {
	MONGODB: 'mongodb://localhost:27017/nodewebsite',
	MONGOSTORE: 'mongodb://localhost:27017/passwordless-keystore',
	SESSION_SECRET: 'mongo db session secret',
	HOSTNAME: 'nodewebsite.com',
	PORT: 8888,
	ENV: 'production',
	MANDRILL_KEY: 'xxxxxx',
	AUTH: {
		USERS: []
	},
	AUTH_OPTIONS: {
		AUTHROOT: '/auth',
		LOGOUT: '/logout/',
		LOGIN: '/login/',
		FAILURE_REDIRECT: '/login/',
		SEND_TOKEN: '/sendtoken/',
		TOKEN_HANDLER: '/check-token/',
		DASHBOARD: '/dashboard/'
	},
	//RUN ON AN IN-MEMORY SOCKET. SEE tasks/setup-socket.sh FOR DETAILS.
	SOCKET: '/var/run/nodewebsite/nodewebsite.sock'
}

try {
	//ENVIRONMENT SPECIFIC SETTINGS ARE
	var _env = JSON.parse( fs.readFileSync('./environment.json') );
	console.log('Environment Found. Using:', _env);
	CONFIG = extend( CONFIG, _env );
} catch (e) {
	console.log('No Environment Override. Using Defaults.');
}

console.log('Environment: ', CONFIG );

module.exports = CONFIG;