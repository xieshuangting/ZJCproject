var headUrl = 'http://10.1.1.39/r/jd?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';

// 改变本页面的iframe的高度
window.onload = function() {
    getHeight();
};

function getHeight(){
    var height = $(window).height();
    $('#main').height(height-5);
}

$(function(){
	getHeight();
	getMenuList();
	// 点击菜单第一级
	$(document).on('click',".left-nav-item-wrapper",function(){
		var secondNavUrl = $(this).find('p').attr('data-url');
		if(secondNavUrl.indexOf('sid')>-1){
			$("#main").attr('src',secondNavUrl);
			getHeight();
		}
		
		if($(this).find('.second-nav').css('display') == 'none'){
			$('.second-nav').slideUp();
			$(this).find('.second-nav').slideDown();
		}else{
			// 如果点击子菜单。则不收缩。点击子菜单之外的则收缩子菜单
			if(!($(event.target).attr('class') == 'second-nav-li')){
				$('.second-nav').slideUp();
			}
		}
		$('.left-nav-item-wrapper').removeClass('visited');
		$(this).addClass('visited');
		$('.img2').hide();
		$('.img1').show();
		$(this).find('.img1').hide();
		$(this).find('.img2').show();
	});
	//点击菜单第二级
	$(document).on('click',".second-nav li",function(){
		var secondNavUrl = $(this).attr('data-url');
		$("#main").attr('src',secondNavUrl);
		getHeight();
	});
});

function getMenuList(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.menu', function(data) {
		var data = data.data.menuList;
		showMenuList(data);
    });
}

function showMenuList(data){
	var $menuList = $("#menuList");
	$menuList.empty();
	data.forEach(function(item,index){
		var $li = $("<li>").addClass('left-nav-item-wrapper').appendTo($menuList);
		if(index == 0){
			$li.addClass('visited');
		}
		var $div = $("<div>").addClass('left-nav-item').appendTo($li);
		$("<img>").addClass('img1').attr('src',item.icon16).appendTo($div);
		$("<img>").addClass('img2').attr('src',item.icon64).appendTo($div);
		$("<p>").text(item.name).attr('data-url',item.url).appendTo($div);
		if(item.function.length){
			var $ul = $("<ul>").addClass('second-nav').appendTo($li);
			item.function.forEach(function(item,index){
				$("<li>").addClass('second-nav-li').text(item.name).attr('data-url',item.url).appendTo($ul);
			});
		}
	})
}