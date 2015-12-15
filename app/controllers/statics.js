var express = require('express'),
	//mongoose = require('mongoose'),
	//deepextend = require('deep-extend'),
	router = express.Router();
 
router.get('/', function(req, res) {
	res.render('homepage', { url: req.path, title: 'Web-home of Keegan Brown, Full-Stack Web Developer in New Orleans', navactive: 'home' });
});
router.get('/keegan-brown-in-real-life', function(req, res) {
	res.render('about-me', { url: req.path, title: 'Keegan Brown, in Real Life. <br />About me, as a dude, doing things that people do.', navactive: 'about' });
});
router.get('/keegan-brown-on-the-internet', function(req, res) {
	res.render('links', { url: req.path, title: 'We all have an internet presence. <br />Here&rsquo;s mine!', navactive: 'links' });
});
router.get('/keegan-brown-curriculum-vitae', function(req, res) {
	res.render('work', { url: req.path, title: 'Curriculum Vitae <hr class="partition" /><strong>Keegan Brown</strong> Full-Stack Web Developer', navactive: 'cv' });
});
router.get('/hi-im-keegan-brown', redirect_to_about);
router.get('/about-me', redirect_to_about);
router.get('/about', redirect_to_about);

router.get('/experience', redirect_to_cv);
router.get('/my-experience', redirect_to_cv);
router.get('/work-experience', redirect_to_cv);
router.get('/resume', redirect_to_cv);


function redirect_to_about (req, res) {
	res.redirect(301, '/keegan-brown-in-real-life/');
}
function redirect_to_links (req, res) {
	res.redirect(301, '/keegan-brown-on-the-internet/');
}
function redirect_to_cv (req, res) {
	res.redirect(301, '/keegan-brown-curriculum-vitae/');
}


module.exports = router;
