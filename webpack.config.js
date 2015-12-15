var config = require('./config.js'),
	path = require('path'),
	webpack = require('webpack'),
	babel = require('babel-core'),
	es2015 = require('babel-preset-es2015'),
	babelloader = require('babel-loader'),
	approot = path.resolve( __dirname );

module.exports = {
    context: approot + "/src",
    entry: { 
    	main: "./bundle.js",  
    	editor: "./editor.js" 
    },
    output: {
    	filename: "[name].js",
    	publicPath: "bin/",
    	path: approot + "/public/bin",
    	chunkFilename: "[chunkhash].js"
    },
	module: {
		loaders: [
			{ 
				test: /\.js$/, 
				loader: 'babel',
				exclude: /node_modules/,
				cacheDirectory: '/tmp',
				query: {
			        presets: ['es2015']
			    }
			}
		]
	},
	resolve: {
		modulesDirectories: ["node_modules"],
	},
	plugins: [
	  new webpack.ProvidePlugin({
	    "$": "jquery",
	    "jQuery": "jquery",
	    "TweenMax": "gsap"
	  })
	]
}