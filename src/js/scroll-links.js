;
var ScrollToPlugin = require('gsap/src/minified/plugins/ScrollToPlugin.min.js')

function apply_scrollinks () {

	$('body').on('click', 'a.scroll-link', function (e) {
		e.preventDefault();
		var $cont = $('html,body'), $hash = $(this.hash), pos = $hash.offset().top,
			time = Math.floor( Math.abs( $(window).scrollTop() - pos ) / 100 ) / 10;
			if ( time < 0.75 ) time = 0.75;
		console.log( pos, time, $cont.scrollTop() - pos, $cont.scrollTop() )
		TweenMax.to( $cont, time, { scrollTop: pos, ease: Strong.easeOut });
	});
}

function apply_scrollsmooth (){
	
	var $win = $(window);		//Window object
	
	var scrollTime = 0.5;
	var scrollDistance = 150;

	$win.on("mousewheel DOMMouseScroll", function(event){

		//event.preventDefault();	

		var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
		var scrollTop = $win.scrollTop();
		var finalScroll = scrollTop - parseInt(delta*scrollDistance);

		TweenMax.to($win, scrollTime, {
			scrollTo : { y: finalScroll, autoKill:true },
				ease: Power1.easeOut,
				overwrite: 5							
			});
	});


	$win.on('keydown', function(e) {
		var finalScroll = 0;
		//down
		if (e.keyCode == 40) {
			e.preventDefault(); //prevent default arrow key behavior
		    finalScroll = $win.height()/1.5;
		}
		//up
		else if (e.keyCode == 38) {
			e.preventDefault(); //prevent default arrow key behavior
		    finalScroll = -$win.height()/1.5;
		}

		//scroll element into view    
		TweenMax.to($win, 0.5, {
			scrollTo : { y: '+='+finalScroll },
				ease: Power2.easeOut					
			});
	});	
	
};
/*
function apply_scrollmod() {
	var $win = $(window),
		$body = $('body'),
		$cont = $body.find('> div'),
		lastScroll = $win.scrollTop();

	$body.css({ height: $body.height() });
	$cont.css({position:'fixed', width: '100%'});

	TweenMax.ticker.addEventListener('tick', function () {
		var _st = $win.scrollTop();
		if (lastScroll !== _st) {	
			lastScroll = _st;	
			TweenMax.to($cont, 0.01, {
				y: -lastScroll,
				ease: Power2.easeOut,
				autoKill: true,
				overwrite: 5							
			});
		}
	});

}
*/
$(function () {

	apply_scrollinks();
	apply_scrollsmooth();
	//apply_scrollmod();

});