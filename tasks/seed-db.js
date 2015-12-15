var mongoose = require('mongoose'),
	config = require('../config.js'),
	gulp = require('gulp'),
	Post = require('../app/models/post.js');


var seed_data = require('../app/db/seed.json'), 
	posts = seed_data.db[0].data.posts; //BUILT FOR GHOST EXPORT

//console.log( posts );
gulp.task("seed-db", function() {
	mongoose.connect(config.MONGODB, {}, () => {		
		do_post_seed();
	});
});

function do_post_seed () {		
	var removePostStream = Post.find({})
		.stream()
		.on('data', (doc) => {
			removePostStream.pause();
			doc.remove( (err, info) => {
				console.log('Deleted: ', info.title);
				removePostStream.resume();
			});
		})
		.on('error', (err) => {
			console.log('Post stream error', err);
		})
		.on('close', () => {
			iterate_through_posts( posts.shift(), posts, iterate_through_posts, all_posts_processed );
		});
}
function iterate_through_posts (_post, arr, next, finished) {
	var callback = () => {
		if ( arr.length ) {
			iterate_through_posts( arr.shift(), arr, iterate_through_posts, finished );
		} else {
			finished();
		}
	}
	if ( _post.status == 'published' ) {
		var newPost = new Post({
			slug: _post.slug,
			title: _post.title,
			content: _post.markdown,
			created_at: _post.created_at,
			updated_at: _post.updated_at,
		}).save((err, data) => {
			if ( !!err ) {
				console.log( 'post seed error:', _post.title );
			} else {
				console.log( 'SAVED:', _post.title );
			}

			callback();		
		});
	} else {
		callback();
	}
}

function all_posts_processed () {
	console.log('all_posts_processed!');
	mongoose.connection.close(function () {
		process.exit();
	});
}