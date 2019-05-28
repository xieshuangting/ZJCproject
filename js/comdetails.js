var headUrl = 'http://10.1.1.39/r/jd?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';

$(function(){
	getHistoryList();
	getComInfo();
})

function getHistoryList(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.historyCompanyBusiness&BANK_ID=5b655257-a90e-4161-86ee-fdc31a80cb1b&CORPORATE_NAME=淄博智源色织科技有限公司', function(data) {
		var data = data.HISTORYBUSINE;
		if(data.length){
			showHistory(data);
		}else{
			$("#comHistoryWrapper").empty();
		}
    });
}

function showHistory(data){
	var length = data.length;
	var width = $('.com-history-content').width();
	var marginRight = (width-length*100)/(length-1);
	console.log(marginRight);
	console.log(width);
	var $historyList = $("#historyList");
	$historyList.empty();
	data.forEach(function(item,index){
		if(item.TYPE == 'B'){
			showHistoryItem($historyList,marginRight,'企业信息变更',index,length,'./img/详情页/变更.png');
		}else{
			showHistoryItem($historyList,marginRight,item.REMARKS,index,length,'./img/详情页/录入.png');
		}
	})
}

function showHistoryItem($ele,marginRight,text,index,length,imgsrc){
	var $div;
	if(index == length-1){
		$div = $("<div>").appendTo($ele);
	}else{
		$div = $("<div>").css('marginRight',marginRight).appendTo($ele);
	}
	$("<img>").attr('src',imgsrc).appendTo($div);
}

function getComInfo(){
	$.get(headUrl + '&cmd=com.awspaas.user.apps.hti.comInfo&ID=048fbc2c-6784-42cc-a246-e6c91fe95e44', function(data) {
		if(data.COMINFO.length){
			var data = data.COMINFO[0];
			showComInfo(data);
		}
    });
}

function showComInfo(data){
	$("#comName").text(data.CORPORATE_NAME);
	$("#socialCode").text(data.SOCIAL_CREDIT_CODE);
	$("#name").text(data.CONTACT);
	$("#phone").text(data.CONTACT_INFO);
	$("#comNum").text(data.COM_NUM);
	$("#registerDate").text(data.REGISTER_DATE);
	$("#invCode").text(data.INVESTIGATION_CODE);
	$("#ecoType").text(data.ECONOMIC_TYPE);
	$("#comAddress").text(data.PROVINCE+" "+data.CITY+" "+data.AREA+" "+data.STREET);

	$("#receivables").text(data.COM_RECEIVABLES);
	$("#netAsset").text(data.COM_NET_ASSET);
	$("#curLiabilities").text(data.COM_CURRENT_LIABILITIES);
	$("#totalAsset").text(data.COM_TOTAL_ASSETS);
	$("#income").text(data.INCOME_PRODUCT);
	$("#mainCost").text(data.MAIN_BUSINESS_COST);
	$("#netProfit").text(data.NET_PROFIT);
	$("#taxTotal").text(data.TAX_AMOUNT);
	$("#inventories").text(data.COM_INVENTORIES);

	$("#totalOut").text(data.TOTAL_OUTSTANDING_LOANS);
	
	// 判断是否
	var $ele = $("#isBelong");
	$ele.empty();
	radiusType(data.IS_BELONG_INDUSTRY,$ele);

	$("#couNew").text(data.COUNTRY_NEWINDUSTRY);
	$("#szNew").text(data.SZ_NEWINDUSTRY);
	var $ele2 = $("#isLoad");
	$ele2.empty();
	radiusType(data.IS_CREDIT_LOAN,$ele2);
	var $ele3 = $("#isSKCW");
	$ele3.empty();
	radiusType(data.SKCW_ST_PRO,$ele3);
	$("#belongIndustry").text(data.BELONGS_INDUSTRY1+"、"+data.BELONGS_INDUSTRY2+"、"+data.BELONGS_INDUSTRY3+"、"+data.BELONGS_INDUSTRY4);

	$("#belongIndustry1").text(data.BELONGS_INDUSTRY1);
	$("#belongIndustry2").text(data.BELONGS_INDUSTRY2);
	$("#belongIndustry3").text(data.BELONGS_INDUSTRY3);
	$("#belongIndustry4").text(data.BELONGS_INDUSTRY4);
}

// 判断是否
function radiusType(data,$ele){
	if(data){
		var $radius1 = $("<span>").addClass('radius').text('是').appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius2.png').prependTo($radius1);
		var $radius2 = $("<span>").addClass('radius').text('否').appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius1.png').prependTo($radius2);
	}else{
		var $radius1 = $("<span>").addClass('radius').text('是').appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius1.png').prependTo($radius1);
		var $radius2 = $("<span>").addClass('radius').text('否').appendTo($ele);
		$("<img>").attr('src','./img/详情页/radius2.png').prependTo($radius2);
	}
}