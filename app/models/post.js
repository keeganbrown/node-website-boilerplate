"use strict";
const mongoose = require('mongoose'),
	stripTags = require('striptags'),
	toMarkdown = require('to-markdown'),
	slug = require('slug');

let PostSchema = new mongoose.Schema({
	slug: { type: String, unique: true, index: true, match: /[a-z0-9-]*/ },
	title: { type: String },
	content: { type: String },
	created_at: { type: Date },
	updated_at: { type: Date, index: true }
});


PostSchema.static('savePostFromEditor', function savePostFromEditor ( postData, callback ) {
	console.log( postData );
	if ( postData.id && postData.content && postData.title ) {
		saveModifiedPost( postData, callback );
	} else if ( !postData.id && postData.content && postData.title ) {
		saveNewPost( postData, callback );
	}
});

var Post = mongoose.model('Post', PostSchema);

function saveModifiedPost ( postData, callback ) {
	Post.findByIdAndUpdate( postData.id, {
			slug: slug( stripTags(postData.title), {lower: true} ),
			title: stripTags(postData.title),
			content: toMarkdown( postData.content ),
			updated_at: Date.now()
		}, { new: true })
		.exec()
		.then( ( doc ) => {
			console.log('updated', doc);
			callback(doc);
		}, ( err ) => {
			console.log( err );
		});
}
function saveNewPost ( postData, callback ) {
	var newPost = new Post({
		slug: slug( stripTags(postData.title), {lower: true} ),
		title: stripTags(postData.title),
		content: toMarkdown( postData.content ),
		updated_at: Date.now(),
		created_at: Date.now(),
	});
	newPost.save((err, data) => {
		if ( !!err ) {
			console.log( 'post save error:', newPost.title );
		} else {
			console.log( 'SAVED:', newPost.title );
		}
		callback(newPost);		
	});
}

module.exports = Post;