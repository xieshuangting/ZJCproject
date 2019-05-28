var headUrl = 'http://10.1.1.38:8088/portal/r/w?sid=dbec7738-6203-4194-bd8a-94464dc1ec24';
window.onload = function() {
    getHeight()
};
// $(window).resize(function() {
//     setIframeHeight(document.getElementById('index'));
// });

// function setIframeHeight(iframe) {
//     if (iframe) {
//         var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
//         if (iframeWin.document.body) {
//             if(iframeWin.document.documentElement.scrollHeight == document.body.clientHeight){
//                 iframe.style.height = (iframeWin.document.documentElement.scrollHeight-64 + 'px') || (iframeWin.document.body.scrollHeight-64 + 'px');
//             }else{
//                 iframe.style.height = (iframeWin.document.documentElement.scrollHeight + 'px') || (iframeWin.document.body.scrollHeight + 'px');
//             }
//         }
//     }
// };

function getHeight(){
    var height = $(window).height();
    $('#index').height(height-64);
}

$(function() {
    getHeight();
    // 获取未阅消息列表
    getUnreadInfo();

    // 点击顶部菜单栏
    $("#topNavList li").on('click', function() {
        var type = $(this).text();
        if (type == '全局视图') {
            window.open('index.html', '_self');
            getHeight();
            $('.visited').removeClass('visited');
        }
        if (type == '待办任务') {
            $("#index").attr('src','menu.html');
            getHeight();
            $(this).find('img').attr('src','./img/全局视图/导航待办选中.png');
            $('.visited').removeClass('visited');
        }
        $(this).addClass('visited');
    });
    // 经过顶部菜单样式的改变
    $("#topNavList li").mouseover(function() {
        var type = $(this).text();
        if($(this).attr('class') == 'visited'){
            return false;
        }
        if (type == '全局视图') {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航全局经过.png');
        } else if (type == '待办任务') {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航待办经过.png');
        } else if (type.indexOf('未阅消息') != -1) {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航消息经过.png');
        } else {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航管理经过.png');
        }
    }).mouseleave(function() {
        var type = $(this).text();
        if($(this).attr('class') == 'visited'){
            return false;
        }
        if (type == '全局视图') {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航全局未选中.png');
        } else if (type == '待办任务') {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航待办未选中.png');
        } else if (type == '未阅消息') {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航消息未选中.png');
        } else {
            $(this).find('.nav-img').attr('src', './img/全局视图/导航管理未选中.png');
        }
    });

    // 点击未阅消息显示和隐藏未阅面板
    $("#info>span").click(showHideInfo);
    $("#info>img").click(showHideInfo);
    // 点击返回更多消息列表
    $(document).on('click','.back-info>img',function(){
        $('.info-detail').hide();
        $('.info-items').show();
    })
    // 点击消息列表展开详细消息
    $(document).on('click','.info-item',function(){
        $('.info-detail').show();
        $('.info-items').hide();
        var infoDes = $(this).find('.info-des').text();
        var infoUrl = $(this).attr('data-url');
        var infoTime = $(this).find('.info-time').text();
        var infoName = $(this).find('.info-name').text();
        var $infoDetail = $('.info-detail');
        $infoDetail.empty();
        var $backInfo = $("<div>").addClass('back-info').appendTo($infoDetail);
        $("<img>").attr('src','./img/全局视图/返回.png').appendTo($backInfo);
        var $p = $("<p>").addClass('clearfix').appendTo($infoDetail);
        $("<span>").addClass('info-name').text(infoName).appendTo($p);
        $("<span>").addClass('info-time').text(infoTime).appendTo($p);
        var $infoDetailContent = $("<div>").addClass('info-detail-content').appendTo($infoDetail);
        $("<img>").attr({'src':infoUrl,'width':'50','height':'50'}).appendTo($infoDetailContent);
        var $infoDetailContentText = $("<div>").addClass('info-detail-content-text').text(infoDes).appendTo($infoDetailContent);
    });
    // 点击更多消息跳转页面
    $(document).on('click','.info-more',function(){
        window.open(headUrl + "&cmd=com.actionsoft.apps.notification_center", "_blank");
    });

    // 滑动显示和隐藏欢迎XX的下拉面板
    $('#welcome').mouseenter(function(){
        $('.welcome-wrapper').slideDown();
    }).mouseleave(function(){
        $('.welcome-wrapper').slideUp();
    })
});

function showHideInfo(){
    var width = $('.info-wrapper').width();
    if(width == 0){
        $('.info-wrapper').animate({width:"268"},300);
    }else{
        $('.info-wrapper').animate({width:"0"},300);
    }
}

function getUnreadInfo(){
    $.get(headUrl + "&cmd=com.awspaas.user.apps.hti.portal.unReadMessage&limit=7", function(data) {
        var data = $.parseJSON(data).data;
        showUnreadInfo(data);
    });
}

function showUnreadInfo(data){
    if (data.pageCount == 0) {
        $('.info-num').text('0').removeClass('info-num-more');
    }else if(data.pageCount > 99){
        $('.info-num').text('99+').css('background','red').addClass('info-num-more');
    }else{
        $('.info-num').text(data.pageCount).css('background','red').removeClass('info-num-more');
        var $infoItems = $("#infoItems");
        $infoItems.empty();
        data.list.forEach(function(item,index){
            var $infoItem = $("<div>").addClass('info-item clearfix').attr('data-url',item.icon).appendTo($infoItems);
            var $p1 = $("<p>").addClass('clearfix').appendTo($infoItem);
            $("<span>").addClass('info-name').text(item.userName).appendTo($p1);
            $("<span>").addClass('info-time').text(item.createTime).appendTo($p1);
            var $p2 = $("<p>").addClass('info-des').text(item.notifyContent).appendTo($infoItem);
            $("<img>").attr('src','./img/全局视图/信封.png').prependTo($p2);
        });
        if(data.pageCount > 7){
            var $div = $("<div>").addClass('info-more').text('更多消息').appendTo($infoItems);
            $("<img>").attr('src','./img/全局视图/more.png').appendTo($div);
        }
    }
}
