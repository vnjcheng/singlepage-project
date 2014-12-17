/**
 * 菜单相应js
 * @author cwj
 * @author 2014-12-04
 */

$(function() {
	// 添加siderbar
	if($('#siderbarL').length === 0) {
		$.ajax({
			url: '../siderbar.html',
			type: 'GET',
			dataType: 'html',
			success: function(json) {
				var content = $('.page-content');

				if(content.length) {
					$('body').append(json).show();
					content.css('margin-top', '0');
					$('#container').append(content);
					content.show();

					bindEvent();
				}
			}
		});
	}
	// 设置siderbar
	window.setSiderBarSelected = function(id) {
		var node = $('#tree_'+id),
			menu = $('.page-sidebar-menu');

		var set = setInterval(function() {
			node = $('#tree_'+id);
			if(node.length) {
				clearInterval(set);
				node.addClass('active');
				node.parents('li', menu).addClass('active open');
				node.parents('.sub-menu', menu).show('fast');
			}
		}, 100);
	};


	function bindEvent() {
		// 菜单栏展开
		$('.page-sidebar-menu').children('li').click(function(e) {
			$(this).siblings('li.open').find('.sub-menu').hide('fast');
			$(this).siblings('li.open').find('li.open').removeClass('open');
			$(this).siblings('li.open').removeClass('open');

			if($(this).children('.sub-menu').length) {
				$(this).toggleClass('open');
				$(this).children('.sub-menu').toggle('fast');
				$(this).find('li.open').children('.sub-menu').hide('fast');
				$(this).find('li.open').removeClass('open');
			}
		});

		$('.sub-menu').children('li').click(function(e) {
			e.stopPropagation();

			$(this).siblings('li.open').find('.sub-menu').hide('fast');
			$(this).siblings('li.open').find('li.open').removeClass('open');
			$(this).siblings('li.open').removeClass('open');

			if($(this).children('.sub-menu').length) {
				$(this).toggleClass('open');
				$(this).children('.sub-menu').toggle('fast');
			} else {
				var li = $(this);

				li.siblings('li').removeClass('active');

				// 消除已选择的项
				var node = li.closest('li.active') || $('.page-sidebar-menu li.active');
				if(li.closest('li.active').length == 0) {
					$('.page-sidebar-menu li.active').removeClass('active');
					$('.sub-menu', $('.page-sidebar-menu li.active')).hide('fast');
				} else {
					node.find('li.active').removeClass('active');
				}

				// 当前项选择使用
				li.parents('li', node).addClass('active');
				li.parents('.sub-menu', node).show('fast');;

				li.addClass('active');
			}
		});


		// spinner
		var spinner = null;
		$('.page-sidebar-menu li').pjax('.pjax', '#content', {
			fragment: '#content',
			timeout: 5000
		});

		$(document).on('pjax:send', function() {
			spinner = new Spinner(SpinnerOpts).spin($('#loading')[0]);
		});

		$(document).on('pjax:complete', function() {
			spinner.stop();
		});
	}
});