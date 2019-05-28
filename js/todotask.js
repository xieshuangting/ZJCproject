var headUrl = 'http://10.1.1.39/r/w?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';
var headUrl2 = 'http://10.1.1.39/r/w?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';

$(function(){
	// 获取待办事项
	getTodoList();
	// 获取未阅消息列表
	getInfoList();

	// 点击更多任务跳转页面
	$("#moreTask").on('click',function(){
		window.open(headUrl2 + "&cmd=com.actionsoft.apps.workbench_main_page", "_blank");
	});
	// 点击更多消息跳转页面
	$("#moreInfo").on('click',function(){
		window.open(headUrl2 + "&cmd=com.actionsoft.apps.notification_center", "_blank");
	});
	
	//切换事项种类
	$(".task-btn-item").on('click',function(){
		var type = $(this).text();
		var prevType = $('.visited').text();
		if(type == prevType)return false
		$('.task-btn-item').removeClass('visited');
		$(this).addClass('visited');
		$('.task-btn-item:not(.visited) img').attr('src','./img/待办任务/任务图标2.png');
		$('.visited img').attr('src','./img/待办任务/任务图标1.png');
		if(type == '待办事项'){
			getTodoList();
		}else{
			getHistoryList();
		}
	});
	// 点击项目操作
	$('.pro-todo-list-content p').on('click',function(){
		var typeUrl = $(this).attr('data-urlname');
		operate(typeUrl);
	})

})

function getTodoList(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.todoTaskList', function(data) {
		var data = data.data.taskList;
		showTodoList(data);
    });
}

function getHistoryList(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.historyTaskList', function(data) {
		var data = data.data.taskList;
		showTodoList(data);
    });
}

function showTodoList(data){
	var $taskLists = $("#taskLists");
	$taskLists.empty();
	var $taskListTop = $("<li>").addClass('task-list-top').appendTo($taskLists);
	$("<p>").text('事项名称').appendTo($taskListTop);
	$("<p>").text('上一步处理人').appendTo($taskListTop);
	$("<p>").text('时间').appendTo($taskListTop);
	data.forEach(function(item,index){
		var url = item.url.slice(item.url.indexOf("w"));
		var $li = $("<li>").appendTo($taskLists);
		$li.bind("click", function() {
	        window.open(url, "_blank");
	    });
		var $p = $("<p>").addClass('task-list-item-first').text(item.title).appendTo($li);
		$("<span>").prependTo($p);
		$("<p>").text(item.ownerName).appendTo($li);
		var time = item.begintime.slice(0, item.begintime.indexOf('|'));
		$("<p>").text(time).appendTo($li);
	})
}
function getInfoList(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.unReadMessage', function(data) {
		var data = data.data.list;
		showInfoList(data);
    });
}

function showInfoList(data){
	var $infoList = $("#infoList");
	$infoList.empty();
	var $taskListTop = $("<li>").addClass('task-list-top').appendTo($infoList);
	$("<p>").text('消息内容').appendTo($taskListTop);
	$("<p>").text('发布人').appendTo($taskListTop);
	$("<p>").text('时间').appendTo($taskListTop);
	data.forEach(function(item,index){
		var $li = $("<li>").appendTo($infoList);
		var $p = $("<p>").addClass('task-list-item-first').text(item.content).appendTo($li);
		$("<span>").prependTo($p);
		$("<p>").text(item.userName).appendTo($li);
		$("<p>").text(item.createTime).appendTo($li);
	})
}

function operate(str){
    var processGroupId = "";
    var processDefId = "";
    if(str == "enterpriseInfoInput"){
        processGroupId="obj_a4f698582454440c8608b153b9b725dc";
        processDefId="obj_b64775e7dd9d4009967c5795213028f2";        
    }else if(str == "singleProjectInfoInput"){
        processGroupId="obj_d396fa9325604f158f4423da83cb217f";
        processDefId="obj_11b1da0189e74633869942a7708ecd87";
    }else if(str == "batchProjectInfoInput"){
        processGroupId="obj_2610bebc45954d67b5101f93e26a9fef";
        processDefId="obj_582fcd1b6a74417a9ba1df5e2b09b21d";
    }else if(str == "enterpriseInfoChange"){
        processGroupId="obj_8a6525f446b0479dbf9dafb86193d2e1";
        processDefId="obj_528e9f36513040b0af73996e8f93c85e";
    }else if(str == "projectInfoChange"){
        processGroupId="obj_e43a305b624349bebdefbe26dfb548d9";
        processDefId="obj_da333fa389724a288c2e16516a18dd6c";
    }else if(str == "nonPerformingStatusApply"){
        processGroupId="obj_85e35fc16d2045699cd98cd6ea64ca73";
        processDefId="obj_208c75659d54444dbb122bf515a2bcd2";
    }else if(str == "riskCompensationApply"){
        processGroupId="obj_59cf0229224142e5b8a7de15efb2723d";
        processDefId="obj_751297bb77e046979f28395dc1d587b8";
    }else if(str == "nonPerformingStatusRevoke"){
        processGroupId="obj_6cc4c296b74a46e3bedcf1a8f76551b8";
        processDefId="obj_62c4743e51f14b1687a9f41b48b5acf7";
    }else if(str == "assetsLiquidateRecordCommit"){
        processGroupId="obj_34cbdebc0ac84bb3b4db4ce9345606c8";
        processDefId="obj_b75746300a0c45a2a8b616c0d50faabf";
    }else if(str == "fundsReturnedRecordCommit"){
        processGroupId="obj_0c66f5b778f24ef59e03e49150bf8dc9";
        processDefId="obj_b347e970d1354ec2adfa6b735f98d09e";
    }else if(str == "assetsLiquidateFinishApply"){
        processGroupId="obj_06e51df2f5b447aa94f7535f1d0c254f";
        processDefId="obj_2c28a87d85e8426b8b083f664ac794ec";
    }else if(str == "assetsCancelVerificationApply"){
        processGroupId="obj_3f0960d8d5244f6797751b3f8d99860a";
        processDefId="obj_99a03ea31ed9449a9f4243da9044fe8b";
    }
    converUrl(processGroupId, processDefId);
}

// 转换链接
function converUrl(processGroupId, processDefId){
    var url = headUrl2+"&cmd=CLIENT_BPM_WORKLIST_PROCESSINST_CREATE_AJAX_PREPAGE&processGroupId=" + processGroupId + "&processDefId=" + processDefId;
    $.ajax({
        url:url,
        type:"get",
        datatype:"json",
        success:function(data){
            window.open(data, "_blank");
        }
    })
}