var webpack = require('webpack'),
	webpackconfig = require('../webpack.config.js');

console.log("start!", webpackconfig);

webpack(webpackconfig, function (err, stats) {
	console.log('webpack done. start app.', err);
	require('../app.js');
}).watch({ // watch options:
    aggregateTimeout: 400, // wait so long for more changes
    poll: true // use polling instead of native watchers
    // pass a number to set the polling interval
}, function(err, stats) {
    console.log('\n\n\nwatch reload!', err);
});;