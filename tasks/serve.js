var gulp = require('gulp'),
	fork = require('child_process').fork,
	gutil = require("gulp-util");

var serverfork = null;

gulp.task("serve", function() {
	gulp.watch(["app/**.js", "app/**/**/**.js", "app/**/**.ejs"], ["serve:restart"]);
	forkapplication();
});

gulp.task("serve:restart", function() {
	console.log('restart webserver');
	forkapplication();
});

function forkapplication () {
	if ( !serverfork ) {
		serverfork = fork('app/app.js');
	} else {
		try {
			serverfork.send('exit');		
		} catch (e) {
			 console.log('app fork not running.');
		}
		serverfork = fork('app/app.js');
	}
}