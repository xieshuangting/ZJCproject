var headUrl = 'http://10.1.1.39/r/jd?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';
// 列表条数
var pageLength = 1;
$(function(){
	getProInfo();
	getProHistory();
	getPropertyList(1);//当前页码
	getCpledgeList(1);
	getCguaranteeList(1);
	// 点击收缩列表
	$(document).on('click','.down',function(){
		var imgUrl = $(this).attr('src');
		if(imgUrl.indexOf('down') != -1){
			$(this).attr('src','./img/详情页/up.png');
			$(this).parents('.table-list').find(".tableList").slideUp();
		}else{
			$(this).attr('src','./img/详情页/down.png');
			$(this).parents('.table-list').find(".tableList").slideDown();
		}
	});
	// 抵押物选择页码
	$(document).on('click',"#newsChange1 .aIndex",function(){
		var indexCur = $(this).text();
		changeNews(indexCur,"#hiddenPageCount","#hiddenIndexCur");
		getPropertyList(indexCur);
	});
	// 质押物选择页码
	$(document).on('click',"#newsChange2 .aIndex",function(){
		var indexCur = $(this).text();
		changeNews(indexCur,"#hiddenPageCount2","#hiddenIndexCur2");
		getCpledgeList(indexCur);
	});
	// 向上向下翻页种类
	$(document).on('click',".prevNext",function(){
		var typeEle = $(this).attr('data-ele');
		var type = $(this).attr('data-type');
		if(typeEle == 1){
			pageTurn(type,"#hiddenIndexCur","#hiddenPageCount",getPropertyList);
		}else if(typeEle == 2){
			pageTurn(type,"#hiddenIndexCur2","#hiddenPageCount2",getCpledgeList);
		}else{
			pageTurn(type,"#hiddenIndexCur3","#hiddenPageCount3",getCguaranteeList);
		}
	});
})

function getProInfo(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.getLoanStatus&CONTRACT_NO=CS20181126300&SOCIAL_CREDIT_CODE=91370323MA3CC8844P', function(data) {
		if(data.code == '1'){
			var data = data.LOANINFO;
	        showProInfo(data);
		}
    });
}

function showProInfo(data){
	$("#comName").text(data.CORPORATE_NAME);
	$("#socialCode").text(data.SOCIAL_CREDIT_CODE);
	$("#creditWay").text(data.CREDIT_WAY);
	$("#creditNo").text(data.CONTRACT_NO);
	$("#creditMoney").text(data.PRINCIPAL_AMOUNT);
	$("#loadBegin").text(data.LOAN_BEGIN_DATE);
	$("#loadEnd").text(data.LOAN_END_DATE);
	$("#loadYears").text(data.LOAN_YEARS);
	$("#annuaRate").text(data.ANNUA_LOAN_RATE);
	$("#annuaRate2").text(data.ANNUA_LOAN_RATE_PROPORTION);
	var $ele1 = $("#loadUse");
	$ele1.empty();
	radiusType(data.LOAN_USE,'LOANUSE1',$ele1,'流动资金贷款','其他贷款');
	$("#handleBank").text(data.HANDLE_BANK);
	$("#handlePeople").text(data.LOAN_CONTACT);
	var $ele2 = $("#reimbursement");
	$ele2.empty();
	radiusType(data.REIMBURSEME_TMEANS,'RT1',$ele2,'一次性还款','分期还款');
	$("#totalOut").text(data.TOTAL_OUTSTANDING_LOANS);
	var $ele3 = $("#firstLoad");
	$ele3.empty();
	radiusType(data.IS_FIRST_LOAN,'1',$ele3,'是','否');
	var $ele4 = $("#isLoadUse");
	$ele4.empty();
	radiusType(data.IS_LOAN_USE,'1',$ele4,'是','否');
	var $ele5 = $("#acquired");
	$ele5.empty();
	radiusType(data.IS_ACQUIRED_MEASURES,'1',$ele5,'是','否');
}

// 判断是否
function radiusType(data,data2,$ele,text1,text2){
	if(data == data2){
		var $radius1 = $("<span>").addClass('radius').text(text1).appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius2.png').prependTo($radius1);
		var $radius2 = $("<span>").addClass('radius').text(text2).appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius1.png').prependTo($radius2);
	}else{
		var $radius1 = $("<span>").addClass('radius').text(text1).appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius1.png').prependTo($radius1);
		var $radius2 = $("<span>").addClass('radius').text(text2).appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius2.png').prependTo($radius2);
	}
}

function getProHistory(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.historyLoanBusiness&CONTRACT_NO=CS20181126300', function(data) {
		if(data.code == '1'){
			var data = data.HISTORYBUSINELOAN;
	        if(data.length){
				showProHistory(data);
			}else{
				$("#proHistoryWrapper").empty();
			}
		}
    });
}

function showProHistory(data){
	var length = data.length;
	var width = $('.com-history-content').width();
	var marginRight
	if(length == 1){
		marginRight = 0;
	}else{
		marginRight = (width-length*100)/(length-1);
	}
	var $historyList = $("#historyList");
	$historyList.empty();
	data.forEach(function(item,index){
		var $div;
		if(index == length-1){
			$div = $("<div>").appendTo($historyList);
		}else{
			$div = $("<div>").css('marginRight',marginRight).appendTo($historyList);
		}
		$("<img>").attr('src','./img/详情页/'+item.TYPE+'1.png').appendTo($div);
	})
}

function getPropertyList(indexCur){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.propertyList&CONTRACT_NO=CS2018124303&page='+indexCur+'&limit='+pageLength, function(data) {
		if(data.code == '1'){
			var data = data;
			// 渲染列表内容
			showPropertyList(data.PROPERTY,"#tableList1",'抵押类型','抵押率(%)','抵押物地址','MORTGAGE_TYPE','MORTGAGED_PROPERTY','MORTGAGED_NET_WORTH','MORTGAGE_RATES','MORTGAGED_PROPERTY_ADDR');
			var pageCount = Math.ceil(data.COUNT/pageLength);
			$("#hiddenPageCount").text(pageCount);
            // 刷新页码
            showPageNum(pageCount,indexCur,"#newsChange1",'1');
		}
    });
}
function getCpledgeList(indexCur){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.cpledgeList&CONTRACT_NO=CS2018124303&page='+indexCur+'&limit='+pageLength, function(data) {
		if(data.code == '1'){
			var data = data;
			// 渲染列表内容
			showPropertyList(data.PROPERTY,"#tableList2",'质押类型','质押率(%)','质押存放地址','PLEDGE_TYPE','PLEDGE','PLEDGE_NET_WORTH','PLEDGE_RATES','PLEDGE_ADDR');
			var pageCount = Math.ceil(data.COUNT/pageLength);
			$("#hiddenPageCount2").text(pageCount);
            // 刷新页码
            showPageNum(pageCount,indexCur,"#newsChange2",'2');
		}
    });
}
function getCguaranteeList(indexCur){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.cguaranteeList&CONTRACT_NO=CS2018124303&page='+indexCur+'&limit='+pageLength, function(data) {
		if(data.code == '1'){
			var data = data;
			// 渲染列表内容
			showCguaranteeList(data.PROPERTY);
			var pageCount = Math.ceil(data.COUNT/pageLength);
			$("#hiddenPageCount3").text(pageCount);
            // 刷新页码
            showPageNum(pageCount,indexCur,"#newsChange3",'3');
		}
    });
}

function showCguaranteeList(data){
	var $ele = $('#tableList3');
	$ele.empty();
	$("<li>").text('保证类型').appendTo($ele);
	$("<li>").text('保证人').appendTo($ele);
	data.forEach(function(item,index){
		$("<li>").text(item.GUARANTEE_TYPE).appendTo($ele);
		$("<li>").text(item.GUARANTEE_PERSON).appendTo($ele);
	})
}

function showPropertyList(data,ele,title1,title2,title3,value1,value2,value3,value4,value5){
	var $ele = $(ele);
	$ele.empty();
	$("<li>").text(title1).appendTo($ele);
	$("<li>").text('名称').appendTo($ele);
	$("<li>").text('净值').appendTo($ele);
	$("<li>").text(title2).appendTo($ele);
	$("<li>").text('权利人').appendTo($ele);
	$("<li>").text(title3).appendTo($ele);
	data.forEach(function(item,index){
		$("<li>").text(item[value1]).appendTo($ele);
		$("<li>").text(item[value2]).appendTo($ele);
		$("<li>").text(item[value3]).appendTo($ele);
		$("<li>").text(item[value4]).appendTo($ele);
		$("<li>").text(item.OBLIGEE).appendTo($ele);
		$("<li>").text(item[value5]).appendTo($ele);
	})
}

// 渲染页码
function showPageNum(pageCount,indexCur,ele,eleType){
    var indexCur = parseInt(indexCur);
    var $ele = $(ele);
    $ele.empty();
    $("<a>").addClass('prevNext').attr({"data-ele":eleType,"data-type":'prev'}).text("<").appendTo($ele);
    if(pageCount<5){
      for(var i = 0;i<pageCount;i++){
        if(indexCur == (i+1)){
          $("<a>").addClass("aIndex now-page").text(i+1).appendTo($ele);
        }else{
          $("<a>").addClass("aIndex").text(i+1).appendTo($ele);
        }
      }
    }else{
      if(indexCur<3||indexCur==3){
        for(var i = 0;i<5;i++){
          if(indexCur == (i+1)){
            $("<a>").addClass("aIndex now-page").text(i+1).appendTo($ele);
          }else{
            $("<a>").addClass("aIndex").text(i+1).appendTo($ele);
          }
        }
        $("<a>").addClass('no-click').text("...").appendTo($ele);
      }else if(indexCur>3&&(indexCur+2)<pageCount){
        $("<a>").addClass('no-click').text("...").appendTo($ele);
        $("<a>").text(indexCur-2).addClass("aIndex").appendTo($ele);
        $("<a>").text(indexCur-1).addClass("aIndex").appendTo($ele);
        $("<a>").text(indexCur).addClass("aIndex now-page").appendTo($ele);
        $("<a>").text(indexCur+1).addClass("aIndex").appendTo($ele);
        $("<a>").text(indexCur+2).addClass("aIndex").appendTo($ele);
        if((indexCur+2)<pageCount){
          $("<a>").addClass('no-click').text("...").appendTo($ele);
        }
      }else if(indexCur>3&&((indexCur+2)>pageCount||indexCur>3&&(indexCur+2)==pageCount)){
        $("<a>").addClass('no-click').text("...").appendTo($ele);
        $("<a>").text(pageCount-4).addClass("aIndex").appendTo($ele);
        $("<a>").text(pageCount-3).addClass("aIndex").appendTo($ele);
        $("<a>").text(pageCount-2).addClass("aIndex").appendTo($ele);
        $("<a>").text(pageCount-1).addClass("aIndex").appendTo($ele);
        $("<a>").text(pageCount).addClass("aIndex now-page").appendTo($ele);
      }
    }
    $("<a>").addClass('prevNext').attr({"data-ele":eleType,"data-type":'next'}).text(">").appendTo($ele);
}

// 向前向后跳转
function pageTurn(type,hiddenIndexCur,PageCountele,getDatafn){
  var indexCur = $(hiddenIndexCur).text();
  var pageCount = $(PageCountele).text();
  pageCount = parseInt(pageCount);
  if(indexCur == ''){
    indexCur = 1;
  }else{
    indexCur = parseInt(indexCur);
  }
  if(type == "prev"){
    if(indexCur > 1){
      indexCur = indexCur-1;
      $(hiddenIndexCur).text(indexCur);
      getDatafn(indexCur);
    }
  }else{
    if(indexCur < pageCount){
      indexCur = indexCur+1;
      $(hiddenIndexCur).text(indexCur);
      getDatafn(indexCur);
    }
  }
}

function changeNews(indexCur,PageCountEle,IndexCurEle){
  var pageCount = $(PageCountEle).text();
  pageCount = parseInt(pageCount);
  $(IndexCurEle).text(indexCur);
  if(indexCur>pageCount){
    return false;
  }else if(indexCur<1){
    return false;
  }
}