"use strict";
var passwordless = require('passwordless'),
	config = require('../../config.js'),
	routeOptions = config.AUTH_OPTIONS,
	restrictedOptions = { 
		failureRedirect: routeOptions.AUTHROOT+routeOptions.FAILURE_REDIRECT 
	};

function passwordlessRouteRestrict () {
	if ( !config.DISABLE_PASSWORDLESS ) {
		//console.log('passwordless auth');
		return passwordless.restricted(restrictedOptions);
	}
	return (req, res, next ) => {
		next();
	}
}

module.exports = passwordlessRouteRestrict;