;
require('./js/common.js');

var MediumEditor = require('medium-editor'),
	editor = new MediumEditor('.editable', {
	    // options go here
	});

function initEditPage () {

	function onSaveButtonClick (e) {
		e.preventDefault();
		$(this).html('<i class="fa fa-spinner fa-spin"></i>').attr('href','#saving-please-wait');
		$('[data-edit-itemid]').each(foreachDataItem);
		console.log('save click');
	}
	function foreachDataItem (i, ele) {
		var data = {
			id: $(ele).attr('data-edit-itemid'),
			title: null,
			content: null
		}
		var _foreachItemEle = foreachItemEle.bind(data);
		$(ele).find('[data-edit-id]').each( _foreachItemEle );
		postItemData( data, function (itemData) {
			location.replace('/posts/'+itemData.slug+'/edit/');
		});
	}
	function foreachItemEle (i, item) {
		var data = this;
		var _key = $(item).attr('data-edit-id');
		data[_key] = $(item).html();
		console.log( 'this', this );
	}
	function postItemData ( postData, callback ) {
		$.ajax({
			type: 'POST',
			url: location.pathname,
			data: postData,
			complete: function ( e, xhr ) {
				//console.log('ajax complete', e, xhr);
			},
			error: function ( error ) {
				console.log('ajax error', error);
				//if (callback) callback();
			},
			success: function ( res ) {
				console.log('ajax success', res);
				if (callback) callback( res );
			}
		});
	}
	function onDeleteButtonClick ( e ) {
		e.preventDefault();
		var context = this;
		$('[data-edit-itemid]').each(function(i,ele) {
			var postData = { id: $(ele).attr('data-edit-itemid') };
			$.ajax({
				type: 'POST',
				url: context.href,
				data: postData,
				complete: function ( e, xhr ) {
					//console.log('ajax complete', e, xhr);
				},
				error: function ( error ) {
					console.log('ajax error', error);
				},
				success: function ( res ) {
					console.log('ajax success', res);
					$('.blog-page-wrap').addClass('border-danger');
					$('.blog-page-wrap > .label').addClass('label-danger').removeClass('label-default').text('Deleted. Click the save NOW button to restore.');
					$('[data-edit-itemid]').attr('data-edit-itemid', '');
				}
			});
		});
	}
	function onNewButtonClick (e) {
		e.preventDefault();
		//console.log( this, e );
		location.replace( this.href );
	}
	function changeEditorNav (e) {
		var tags = $('[data-editor-tags]').eq(0).attr('data-editor-tags').split(',');
		tags = tags.map(function (value, i) {
			return '#'+value+'-btn';
		});
		$('#usertools nav .btn').removeClass('show-nav-btn');
		tags.forEach(function (value, i) {
			$(value).addClass('show-nav-btn');
		});
		//console.log( tags );
	}

	$('body').on('click','.editable a', function (e) {
		e.preventDefault();
	});
	$(window).on('pjax:success', function (e) {
		changeEditorNav();
	});
	$('#usertools').on('click', 'a[href$="/delete/"]', onDeleteButtonClick );
	$('#usertools').on('click', 'a[href$="/auth/save/"]', onSaveButtonClick );
	$('#usertools').on('click', 'a[href$="/posts/new/"]', onNewButtonClick );

	changeEditorNav();
}
$(function () {
	initEditPage();
});
