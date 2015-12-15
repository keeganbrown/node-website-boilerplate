;require('jquery-pjax');

$(function () {

	var PageTween = TweenMax.to({},0.1,{}),
		$doc = $(document),
		_contentLoaded = 0,
		pjaxBox = '#pjax-wrap',
		pjaxBoxInner = pjaxBox+' > div';

	$doc.pjax(
		'a[href^="/"]:not(a[data-forcerefresh]), a[href^="'+(window.location.protocol + '//' + window.location.host)+'"]:not(a[data-forcerefresh])', 
		pjaxBox, 
		{ timeout: 10000 }
	);

	$doc.on({
		'pjax:send': function() { 
			_contentLoaded = 0;
			changeCurrentNav();
		},
		'pjax:success': function (e) {
			//e.preventDefault();
			_contentLoaded++;
		},
		'pjax:complete': function (e) {
			pageTransitionIn();
		},
		'pjax:timeout': function (e) {
			//e.preventDefault();
			_contentLoaded = 0;
		},
		'pjax:click': function () {
			//toggleMobileNav(true);
			pageTransitionOut( pageTransitionIn );			
		},
		'pjax:beforeReplace': function() { 
			if ( PageTween ) {
				PageTween.totalProgress(1);
			}
		},
		'pjax:end': function() {
			//console.log('pjax end');
			changeCurrentNav();
			if ( _contentLoaded == 1 ) {
				_contentLoaded++;
				pageTransitionIn();
			}
		}
	});	

	function pageTransitionOut ( callback ) {
		PageTween = TweenMax.fromTo(pjaxBox, 0.3, 
			{ opacity: 1 }, 
			{ opacity: 0, ease: Strong.easeOut, 
				onComplete: function () {
					_contentLoaded++;
					callback();
				} 
			});
	}
	function pageTransitionIn () {
		if ( _contentLoaded == 2 ) {
			PageTween = TweenMax.fromTo(pjaxBox, 1, { opacity: 0 }, 
				{ opacity: 1, ease: Strong.easeOut, onComplete: function () {
					//$(pjaxBox).removeClass('loading');
					_contentLoaded = 0;		
				} 
			});
		}
	}

	function changeCurrentNav() {
		$('nav .active').removeClass('active');
		if (location.pathname.length > 1) {
			var item = $('nav li a[href$="'+location.pathname+'"]');
			item.addClass('active');
		} else {
			$('nav a[href="/"], nav a[href="'+(window.location.protocol + '//' + window.location.host)+'"]').addClass('active');
		}
		$('.navbar-collapse').collapse('hide');
	}	

});