"use strict";
var express = require('express'),
	mongoose = require('mongoose'),
	//striptags = require('striptags'),
	restricted = require('./_restricted.js'),
	Post = require('../models/post.js'),
	router = express.Router();

// middleware specific to this router
router.get('/', 
	(req, res) => {
		render_posts_data({}, { 
			title: 'Thoughts, rants, and shoptalk. <br /><em>You could call it a blog.</em>', 
			navactive:'posts' 
		}, 'blog-index', req, res);
	}
);

// NEW POST EDITING
router.get('/new/', 
	restricted(),
	(req, res) => {
		let newPostOptions = { 
			title: 'New Post',
			navactive: 'posts', 
			editclass: 'editable',
			data: [{
				title: "New Post",
				content: "New Content",
				updated_at: Date.now()
			}]
		}
		//console.log( 'New Post: ', newPostOptions );
		res.render( 'blog-page', newPostOptions );
	}
);
router.post('/new/', 
	restricted(),
	(req, res) => {
		Post.savePostFromEditor(req.body, (post) => {
			res.json( post.toObject() );
		});
	}
);

//GET A SINGLE POST
router.get('/:postslug', (req, res) => {
	render_posts_data(
		{ slug: req.params.postslug }, 
		{ navactive:'posts', editclass:'' }, 
		'blog-page', req, res);
	}
);

// POST EDITING
router.get('/:postslug/edit/', 
	restricted(),
	(req, res) => {
		render_posts_data(
			{ slug: req.params.postslug }, 
			{ navactive: 'posts', editclass:'editable' }, 
			'blog-page', req, res);
	}
);
router.post('/:postslug/edit/', 
	restricted(),
	(req, res) => {
		Post.savePostFromEditor(req.body, (post) => {
			res.json( post.toObject() );
		});
	}
);
router.post('/:postslug/delete/', 
	restricted(),
	(req, res) => {
		if ( !!req.body.id ) {
			Post.findByIdAndRemove(req.body.id)
				.exec()
				.then( (post) => {
					res.json( post.toObject() );
				}, (error) => {
					res.json( { error:'delete error' } )
				});
		}
	}
);



router.get('/json/', (req, res) => {
	get_posts_json({}, req, res);
});
router.get('/json/:postslug', (req, res) => {
	get_posts_json({ slug: req.params.postslug }, req, res);
});

function render_posts_data (search, pageoptions, template, req, res) {
	Post.find(search)
		.sort({ updated_at: -1 })
		.exec()
		.then( (data) => {
			if ( typeof data.length === 'undefined' ) { 
				if ( !pageoptions.title ) { 
					pageoptions.title = data.title 
				};
				data = [ data ];
			};
			if ( !!search.slug && data.length === 0 ) {
				res.status(404).render('error');
				return;
			}
			
			pageoptions.data = data;
			//console.log( 'Find Post: ', data);
			res.render( template, pageoptions );
		}, (err) => {
			console.log(err);
			pageoptions.data = [];
			res.status(404).render('error');
		});
}
function get_posts_json (search, req, res) {
	Post.find(search)
		.exec()
		.then( (data) => {
			res.json(data);
		}, (err) => {
			console.log(err);
			res.json({});
		});
}

module.exports = router;
