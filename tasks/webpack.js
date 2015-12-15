var gulp = require('gulp'),
	gutil = require("gulp-util"),
	source = require('vinyl-source-stream'),
	webpack = require('webpack'),
	WebpackDevServer = require("webpack-dev-server"),
	webpackconfig = require('../webpack.config.js');


console.log("start!", webpackconfig);

gulp.task('webpack', function(callback) {
    // run webpack
    var productionConfig = Object.create(webpackconfig);
    productionConfig.plugins = productionConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: false,
			compress: false
		})
	);
    webpack(productionConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        //callback();
    });
});

function webpack_dev_build (callback) {

	// modify some webpack config options
	var developmentConfig = Object.create(webpackconfig);
	developmentConfig.devtool = "sourcemap";
	developmentConfig.debug = true;

	// create a single instance of the compiler to allow caching
	var devCompiler = webpack(developmentConfig);

	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:dev", err);
		gutil.log("[webpack:dev]", stats.toString({
			colors: true
		}));
		//callback();
	});
}
gulp.task("webpack:dev", function(callback) {
	// run webpack
	webpack_dev_build(callback);
	gulp.watch(["src/bundle.js", "src/editor.js", "src/js/**.js"], function () {
		console.log('webpack rebuild');
		webpack_dev_build(callback);
	});
});



module.exports = webpack;