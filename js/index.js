var headUrl = 'http://10.1.1.39/r/jd?sid=fd0466ed-77b6-48e8-9268-65db7a7dd68b';
$(function() {
    // 数据初始化
    sessionStorage.removeItem("bankId");
    sessionStorage.removeItem("areaText");
    sessionStorage.removeItem("areaTextRight");
    sessionStorage.removeItem("areaCode");
    sessionStorage.removeItem("areaCodeRight");
    sessionStorage.setItem("capital", 4);

    // 获取用户角色
    // getRole();
    // 获取资金状态，入库总额，项目企业
    getStaticList();
    // 获取项目企业数
    getProAmount();
    // 获取新兴产业
    getIndustry();
    // 获取深圳地图
    getMapData('json/sz.json');
    // 获取同比
    getCompare();

    // 点击事件
    // 点击指标切换地图和产业
    $(document).on('click', ".capital li", function() {
        var capital = $(this).attr("data-index");
        if (capital == 8) {
            return false;
        }
        if (sessionStorage.getItem("capital") != capital) {
            sessionStorage.setItem("capital", capital);
            // 判断是否存在区域信息
            var areaText = sessionStorage.getItem("areaText");
            chooseMapUrl(areaText);
            getIndustry();
        } else {
            return false;
        }
    });
    // 点击银行切换地图和产业
    $(document).on('click', ".bank-item", function() {
        var bankId = $(this).attr("data-bankId");
        var bankName = $(this).find('.bank-item-name').text();
        showLabel('#classLabelsBank', bankName, './img/全局视图/title3.png', 'closeLabelsBank');
        if (sessionStorage.getItem("bankId") != bankId) {
            sessionStorage.setItem("bankId", bankId);
            sessionStorage.setItem("bankName", bankName);
            // 判断是否存在区域信息
            var areaText = sessionStorage.getItem("areaText");
            chooseMapUrl(areaText);
            getIndustry();
        }
    });
    // 点击产业切换地图
    $(document).on('click', ".industry-item", function() {
        var industryId = $(this).attr('data-industry');
        var industryName = $(this).find('.industry-item-title').text();
        showLabel('#classLabelsIndustry', industryName, './img/全局视图/title7.png', 'closeIndustry');
        if (sessionStorage.getItem("industryId") != industryId) {
            sessionStorage.setItem("industryId", industryId);
            sessionStorage.setItem("bankName", industryName);
            // 判断是否存在区域信息
            var areaText = sessionStorage.getItem("areaText");
            chooseMapUrl(areaText);
        }
    });
    // 点击显示更多列表
    $(document).on('click','.more',function(){
        $(this).hide();
        $(this).siblings('.closemore').show();
        var type = $(this).siblings('h2').text();
        var moreData;
        var eleType;
        if(type.indexOf('入库') != -1){
            moreData = amountMaps;
            eleType = 0;
        }else{
            moreData = companyCountMaps;
            eleType =1;
        }
        if(moreData.length>4){
            $(this).siblings('.more-wrapper').css('boxShadow','0px 5px 6px #dcdcdc');
            $(this).siblings('.more-wrapper').slideDown();
        }else{
            $(this).siblings('.more-wrapper').css('minHeight','74px');
            $(this).siblings('.more-wrapper').show();
        }
        showMoreList(moreData,eleType);
    });
    // 点击更多面板中的银行切换地图和产业
    $(document).on('click', ".more-ul li", function() {
        var bankId = $(this).attr("data-bankId");
        var bankName = $(this).find('.more-text').text();
        showLabel('#classLabelsBank', bankName, './img/全局视图/title3.png', 'closeLabelsBank');
        if (sessionStorage.getItem("bankId") != bankId) {
            sessionStorage.setItem("bankId", bankId);
            sessionStorage.setItem("bankName", bankName);
            // 判断是否存在区域信息
            var areaText = sessionStorage.getItem("areaText");
            chooseMapUrl(areaText);
            getIndustry();
        }
    });

    // 关闭标签事件
    // 关闭产业标签
    $(document).on('click', '#closeIndustry', function() {
        sessionStorage.removeItem("industryId");
        sessionStorage.removeItem("industryName");
        $('#classLabelsIndustry').empty();
        // 判断是否存在区域信息
        var areaText = sessionStorage.getItem("areaText");
        chooseMapUrl(areaText);
    });
    // 关闭银行标签
    $(document).on('click', '#closeLabelsBank', function() {
        sessionStorage.removeItem("bankId");
        sessionStorage.removeItem("bankName");
        $('#classLabelsBank').empty();
        // 判断是否存在区域信息
        var areaText = sessionStorage.getItem("areaText");
        chooseMapUrl(areaText);
        getIndustry();
    });
    // 关闭区域标签
    // 关闭地图 区 选项 ,刷新地图
    $(document).on('click', '#closeLabelsArea1', function() {
        sessionStorage.removeItem("areaText");
        sessionStorage.removeItem("areaCode");
        sessionStorage.removeItem("areaTextRight");
        sessionStorage.removeItem("areaCodeRight");
        $('#classLabelsArea1').empty();
        $('#classLabelsArea2').empty();
        getMapData('json/sz.json');
        getIndustry();
    });
    // 关闭街道标签
    $(document).on('click', '#closeLabelsArea2', function() {
        sessionStorage.removeItem("areaTextRight");
        sessionStorage.removeItem("areaCodeRight");
        $('#classLabelsArea2').empty();
        getIndustry();
    });
    // 关闭更多列表
    $(document).on('click', '.closemore', function() {
        $(this).hide();
        $(this).siblings('.more').show();
        $(this).siblings('.more-wrapper').slideUp();
    });
});

// 判断地图加载的是区域还是街道
function chooseMapUrl(areaText) {
    var mapUrl = '';
    if (areaText != undefined) {
        var cityProper = {
            '龙岗区': 'json/深圳市各区街道地图json/深圳市-龙岗区.json',
            '宝安区': 'json/深圳市各区街道地图json/深圳市-宝安区.json',
            '光明区': 'json/深圳市各区街道地图json/深圳市-光明区.json',
            '坪山区': 'json/深圳市各区街道地图json/深圳市-坪山新区.json',
            '龙华区': 'json/深圳市各区街道地图json/深圳市-龙华新区.json',
            '大鹏区': 'json/深圳市各区街道地图json/深圳市-大鹏新区.json',
            '南山区': 'json/深圳市各区街道地图json/深圳市-南山区.json',
            '福田区': 'json/深圳市各区街道地图json/深圳市-福田区.json',
            '罗湖区': 'json/深圳市各区街道地图json/深圳市-罗湖区.json',
            '盐田区': 'json/深圳市各区街道地图json/深圳市-盐田区.json',
        };
        mapUrl = cityProper[areaText];
    } else {
        mapUrl = 'json/sz.json';
    }
    getMapData(mapUrl);
}

// 获取用户角色
function getRole() {
    $.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.roleJudgement', function(data) {
        console.log(data);
        // var role = data;
        // // sessionStorage.setItem("bankId", role);
    });
}

// 渲染资金状态，入库总额，项目企业的整体列表
function getStaticList() {
    $.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.companyAmountRank', function(data) {
        var data = data;
        amountMaps = data.amountMaps;
        companyCountMaps = data.companyCountMaps;
        var fundDistMaps = data.fundDistMaps;
        // 显示资金状态分布
        showCapital(fundDistMaps);
        // 显示入库总额排名 绑定的id,数据,渲染的条数,类别
        showlist("#bank_items", amountMaps, 3, 'one');
        // 显示项目企业数排名
        showlist("#bank_items2", companyCountMaps, 3, 'two');
    })
}

// 资金状态分布列表
function showCapital(data) {
    // 渲染出资金状态分布列表
    var data = data[0];
    showSingleCapital('proj_amount_total', data.PROJ_AMOUNT_TOTAL, 1);
    showSingleCapital('bad_amount_total', data.BAD_AMOUNT_TOTAL, 2);
    showSingleCapital('appropriation_amount_total', data.APPROPRIATION_AMOUNT_TOTAL, 4);
    showSingleCapital('returned_amount_total', data.RETURNED_AMOUNT_TOTAL, 5);
    showSingleCapital('returned_amount', data.RETURNED_AMOUNT, 6);
    showSingleCapital('cancle_amount_total', data.CANCLE_AMOUNT_TOTAL, 7);
    showSingleCapital('fund_pool_remaining', data.FUND_POOL_REMAINING, 8);
}

// 资金状态分布单个列表渲染
function showSingleCapital(id, money, index) {
    var ele = document.getElementById(id);
    ele.innerHTML = clearNull(money);
    $(ele).parents('li').attr('data-index', index);
}

//渲染左侧的列表
function showlist(idEl, data, count, type) {
    // 渲染入库总额排名
    var $inStorage = $(idEl);
    $inStorage.empty();
    if (data.length == 0) {
        return false;
    }
    data.forEach(function(item, index) {
        if (index < count) {
            var $bankItem = $("<div>").attr('data-bankId', item.BANK_ID).addClass("bank-item").appendTo($inStorage);
            $("<img>").attr({ 'src': './img/全局视图/排名' + (index + 1) + '.png', 'width': '41', 'height': '41' }).addClass('bank-item-img').appendTo($bankItem);
            var $bankItemDiv = $("<div>").addClass("bank-item-div").appendTo($bankItem);
            $("<p>").addClass('bank-item-name').text(item.BANK_NAME).appendTo($bankItemDiv);
            if (type == "one") {
                $("<p>").addClass('bank-item-num').text(item.PRINCIPAL_AMOUNT).appendTo($bankItemDiv);
            } else if (type == "two") {
                $("<p>").addClass('bank-item-num').text(item.COMPANY_COUNTS).appendTo($bankItemDiv);
            }
        }
    });
}

// 获取项目企业数
function getProAmount() {
    var bankId = sessionStorage.getItem("bankId");
    $.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.CompanyCount&BANK_ID=' + bankId, function(data) {
        var data = data.CompanyCount;
        showProAmount(data);
    })
}

// 渲染项目企业数
function showProAmount(data) {
    var data = clearNull(data);
    var ele = document.getElementById('CompanyCount');
    ele.innerHTML = data;
    $(ele).parents('li').attr('data-index', 9);
    var ele2 = document.getElementById('CompanyCount2');
    ele2.innerHTML = data;
    $(ele).parents('li').attr('data-index', 9);
}

// 获取深圳市战略新兴产业
function getIndustry() {
    var bankId = sessionStorage.getItem("bankId");
    var fundStatus = sessionStorage.getItem("capital");
    var areaCode = sessionStorage.getItem("areaCode");
    var areaCode2 = sessionStorage.getItem("areaCodeRight");
    var param1 = '';
    var param2 = '';
    var param3 = '';
    // 判断是否拼接参数
    if (fundStatus) {
        param1 = "&CAPITAL_STATUS=" + fundStatus;
    }
    // 如果存在街道的code就不用区的code
    if (areaCode2) {
        param2 = "&AREA_CODE=" + areaCode2;
    } else if (areaCode) {
        param2 = "&AREA_CODE=" + areaCode;
    }
    if (bankId) {
        param3 = "&BANK_ID=" + bankId;
    }
    var param = param1 + param2 + param3;

    $.get(headUrl + "&cmd=com.awspaas.user.apps.hti.portal.get_industry_distribution_info" + param, function(data) {
        showIndustry(data.industryDistribution);
    });
}

// 渲染新兴产业
function showIndustry(data) {
    var $industryItems = $("#industry_items");
    $industryItems.empty();
    //显示总和
    var industryTotal = 0;
    data.forEach(function(item, index) {
        industryTotal = industryTotal + parseFloat(clearNull(item.AMOUNT_TOTAL));
        if (item.SZ_NEWINDUSTRY_NAME == '新一代信息技术') {
            showIndustryList('industry-item bg-blue', './img/全局视图/产业信息技术.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        } else if (item.SZ_NEWINDUSTRY_NAME == '高端装备制造') {
            showIndustryList('industry-item bg-blue2', './img/全局视图/产业高端装备.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        } else if (item.SZ_NEWINDUSTRY_NAME == '新材料') {
            showIndustryList('industry-item bg-red', './img/全局视图/产业新材料.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        } else if (item.SZ_NEWINDUSTRY_NAME == '绿色低碳') {
            showIndustryList('industry-item bg-green', './img/全局视图/产业低碳.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        } else if (item.SZ_NEWINDUSTRY_NAME == '生物医药') {
            showIndustryList('industry-item bg-blue', './img/全局视图/产业医药.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        } else if (item.SZ_NEWINDUSTRY_NAME == '海洋经济') {
            showIndustryList('industry-item bg-blue2', './img/全局视图/产业海洋.png', item.AMOUNT_TOTAL, item.SIGN, item.SZ_NEWINDUSTRY_NAME, item.SZ_NEWINDUSTRY_CODE); //颜色类，产业图片
        }
    });
    $("#industryTotal").text(industryTotal);
}

// 具体渲染单个的新兴产业
function showIndustryList(colorClass, industryImg, amountTotal, sign, name, industryId) {
    var $industryItems = $("#industry_items");
    var $industryItem = $("<div>").attr('data-industry', industryId).addClass(colorClass).appendTo($industryItems);
    var $industryItemImg = $("<div>").addClass('industry-item-img').appendTo($industryItem);
    $("<img>").attr({ 'src': industryImg, 'width': '50', 'height': '50' }).appendTo($industryItemImg);
    var amountTotal1;
    if (!amountTotal) {
        amountTotal1 = '0.00';
    } else {
        amountTotal1 = amountTotal;
    }
    var $p = $("<p>").text(amountTotal1).appendTo($industryItemImg);
    if (sign == 1) {
        $("<img>").attr('src', './img/全局视图/产业上升.png').appendTo($p);
    } else {
        $("<img>").attr('src', './img/全局视图/产业下降.png').appendTo($p);
    }
    $("<p>").addClass('industry-item-title').text(name).appendTo($industryItem);
}

// 获取深圳地图数据
function getMapData(mapUrl) {
    // 初始化echarts示例mapChart
    var mapChart = echarts.init(document.getElementById('map_chart'));
    mapChart.showLoading();

    var industryId = sessionStorage.getItem("industryId");
    var bankId = sessionStorage.getItem("bankId");
    var fundStatus = sessionStorage.getItem("capital");
    var areaCode = sessionStorage.getItem("areaCode");
    var mapStatus = sessionStorage.getItem("mapStatus");
    var industryType = sessionStorage.getItem("industryType");
    var param1 = '';
    var param2 = '';
    var param3 = '';
    var param4 = '';
    var param5 = '';
    if (fundStatus) {
        param1 = "&CAPITAL_STATUS=" + fundStatus;
    }
    if (industryId) {
        param2 = "&SZ_NEWINDUSTRY=" + industryId;
    }
    if (bankId) {
        param3 = "&BANK_ID=" + bankId;
    }
    if (areaCode) {
        param4 = "&AREA_CODE=" + areaCode;
    } else {
        param4 = "&AREA_CODE=4403";
    }
    // if (industryType) {
    //     param5 = "&INDUSTRY_TYPE=" + industryType;
    // }
    var param = param1 + param2 + param3 + param4 + param5;
    // &MAP_TYPE='+mapStatus
    // &cmd=com.awspaas.user.apps.hti.portal.get_map_info&CAPITAL_STATUS=3&BANK_ID=e5c51df1-dc84-494a-a755-97b31ee3a4ef 多加参数 AREA_CODE
    $.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.get_map_info' + param, function(data) {
        // console.log(data);
        showMapData(data, mapUrl);
    });
}

// 渲染地图数据的具体数据
function showMapData(data, mapUrl) {
    // 改变指标标题  根据存储的capital来判断指标
    var $mapTotalMoney = $("#mapTotalMoney");
    $mapTotalMoney.empty();
    var titleList = [{ "index": 1, "name": "贷款项目总额(万元)" }, { "index": 2, "name": "不良贷款总额(万元)" }, { "index": 4, "name": "风险补偿总额(万元)" }, { "index": 5, "name": "资金返还总额(万元)" }, { "index": 6, "name": "待返还总额(万元)" }, { "index": 7, "name": "核销总额(万元)" }, { "index": 8, "name": "项目企业数(家)" }];
    var capitalIndex = sessionStorage.getItem("capital");
    var mapTotalMoney = '';
    titleList.forEach(function(item, index) {
        if (item.index == capitalIndex) {
            mapTotalMoney = item.name;
        }
    })
    var headName = '';
    if (sessionStorage.getItem('areaText')) {
        headName = sessionStorage.getItem('areaText');
    } else {
        headName = '全市';
    }
    $("<p>").text(headName + mapTotalMoney).appendTo($mapTotalMoney);

    // // 存储定时比较的初始数据
    // sessionStorage.setItem("key", data);
    // 定义最大的range值
    var maxCount = 0;
    // 定义存放最大值的数组
    var countList = [];
    // 定义地图渲染需要的数组
    var countData = [];
    // 定义右边的总数
    var count = 0;
    // 得到总数，最大值的数组，地图渲染需要的数据

    // 当返回的数据为空时
    if (data.capitalDistributionMapInfo.length == 0) {
        var name = null;
        var areaCode = "";
        count = 0;
        countList[0] = 0;
        countData[0] = { name: name, value: 0, areaCode: areaCode };
    } else {
        data.capitalDistributionMapInfo.forEach(function(item, index) {
            var name = item.AREA_NAME;
            var value = item.AMOUNT_TOTAL;
            var areaCode = item.AREA_CODE;
            count += value;
            countList[index] = item.AMOUNT_TOTAL;
            countData[index] = { name: name, value: value, areaCode: areaCode };
        });
    }

    //渲染指标总和
    showCapitalCount(count);
    // 计算最大值
    maxCount = Math.max.apply(null, countList);
    // 渲染各地区的排名情况
    showArea(data.capitalDistributionMapInfo, maxCount);
    var mapChart = echarts.init(document.getElementById('map_chart'));
    mapChart.hideLoading();

    $.get(mapUrl, function(geoJson) {
        if (mapTotalMoney.indexOf("可申请") != -1) {
            // 绿色
            showCusDistributionChart(geoJson, countData, maxCount, '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c', mapTotalMoney);
        } else if (mapTotalMoney.indexOf("资金池") != -1 || mapTotalMoney.indexOf("核销") != -1 || mapTotalMoney.indexOf("待返还") != -1) {
            // 蓝色
            showCusDistributionChart(geoJson, countData, maxCount, '#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c', mapTotalMoney);
        } else if (mapTotalMoney.indexOf("风险") != -1 || mapTotalMoney.indexOf("资金返还") != -1) {
            // 黄色
            showCusDistributionChart(geoJson, countData, maxCount, '#fffae4', '#ece1b5', '#f9e493', '#f7d554', '#ffca00', mapTotalMoney);
        } else if (mapTotalMoney.indexOf("不良") != -1) {
            // 红色
            showCusDistributionChart(geoJson, countData, maxCount, '#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15', mapTotalMoney);
        } else {
            // 绿色
            showCusDistributionChart(geoJson, countData, maxCount, '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c', mapTotalMoney);
        }
    })
}

// 渲染指标总和
function showCapitalCount(count) {
    var $mapTotalMoney = $("#mapTotalMoney");
    var countStr = '' + count;
    var $mapTotaldiv = $("<div>").appendTo($mapTotalMoney);
    if (countStr.length < 10) {
        var leftLength = 10 - countStr.length;
        for (var i = 0; i < leftLength; i++) {
            $("<span>").text('0').appendTo($mapTotaldiv);
        }
    }
    for (var i = 0; i < countStr.length; i++) {
        $("<span>").text(countStr.charAt(i)).appendTo($mapTotaldiv);
    }
}

// 渲染地图各地区的排名图表
function showArea(data, maxCount) {
    if (data.length == 0) {
        return false;
    }
    if (!maxCount) {
        maxCount = 100;
    }
    var $mapList = $("#mapList");

    var maxCountList = [];
    var dataValue = [];
    var dataText = [];
    var datalength = data.length;
    //根据数据条数改变容器高度
    $mapList.height(datalength * 30);

    data.forEach(function(item, index) {
        maxCountList[index] = { value: maxCount, code: item.AREA_CODE };
        dataValue[index] = { value: item.AMOUNT_TOTAL, code: item.AREA_CODE };
        dataText[index] = item.AREA_NAME;
    });
    dataText.reverse();

    var mapList = echarts.init(document.getElementById('mapList'));
    option = {
        color: ['#61A8FF'], //进度条颜色
        grid: {
            left: '30px', //如果离左边太远就用这个......
            right: '30px',
            bottom: '-40px',
            top: '-20px',
            containLabel: true
        },
        xAxis: [{
                show: false,
            },
            {
                show: false,
            }
        ],
        yAxis: {
            type: 'category',
            axisLabel: {
                show: false, //让Y轴数据不显示
            },
            axisTick: {
                show: false, //隐藏Y轴刻度
            },
            axisLine: {
                show: false, //隐藏Y轴线段
            },
        },
        series: [
            //背景色--------------------我是分割线君------------------------------//
            {
                show: true,
                type: 'bar',
                barGap: '-100%',
                barWidth: '40%', //统计条宽度 
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: 'rgba(102, 102, 102,0.5)'
                    },
                },
                z: 1,
                data: maxCountList, //最大的数值
            },
            //蓝条--------------------我是分割线君------------------------------//
            {
                show: true,
                type: 'bar',
                barGap: '-100%',
                barWidth: '40%', //统计条宽度
                itemStyle: {
                    normal: {
                        barBorderRadius: 20, //统计条弧度
                        color: {
                            colorStops: [{
                                offset: 0,
                                color: '#3dc0e9' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#45e3cf' // 100% 处的颜色
                            }],
                            globalCoord: false, // 缺省为 false
                        }
                    },
                },
                max: 1,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff', //百分比颜色
                        },
                        position: 'inside',
                    }
                },
                labelLine: {
                    show: false,
                },
                z: 2,
                data: dataValue.reverse(),
            },
            //数据条--------------------我是分割线君------------------------------//
            {
                show: true,
                type: 'bar',
                xAxisIndex: 1, //代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
                barGap: '-100%',
                barWidth: '70%', //统计条宽度
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: 'rgba(22,203,115,0.05)'
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: [0, '-100%'],
                        rich: { //富文本
                            start1: {
                                width: 15,
                                height: 15,
                                align: 'center',
                                backgroundColor: '#22ace6',
                                borderRadius: 10,
                                color: '#fff'
                            },
                            black: { //自定义颜色
                                color: '#000',
                                fontSize: 12,
                                padding: [0, 0, 0, 5]
                            },
                        },
                        formatter: function(data) {
                            return '{start1|' + (datalength + 1 - (data.dataIndex + 1)) + '}' + '{black|' + dataText[data.dataIndex] + '}';
                        },
                    }
                },
                data: dataValue
            }
        ]
    };
    mapList.resize();
    mapList.setOption(option);
    window.addEventListener("resize", function() {
        mapList.resize();
    });
}

// 深圳地图制作
function showCusDistributionChart(geoJson, dataList, maxCusCount, color1, color2, color3, color4, color5, name) {
    var mapChart = echarts.init(document.getElementById('map_chart'));
    var cityProper = {
        '龙岗区': 'json/深圳市各区街道地图json/深圳市-龙岗区.json',
        '宝安区': 'json/深圳市各区街道地图json/深圳市-宝安区.json',
        '光明区': 'json/深圳市各区街道地图json/深圳市-光明区.json',
        '坪山区': 'json/深圳市各区街道地图json/深圳市-坪山新区.json',
        '龙华区': 'json/深圳市各区街道地图json/深圳市-龙华新区.json',
        '大鹏区': 'json/深圳市各区街道地图json/深圳市-大鹏新区.json',
        '南山区': 'json/深圳市各区街道地图json/深圳市-南山区.json',
        '福田区': 'json/深圳市各区街道地图json/深圳市-福田区.json',
        '罗湖区': 'json/深圳市各区街道地图json/深圳市-罗湖区.json',
        '盐田区': 'json/深圳市各区街道地图json/深圳市-盐田区.json',
    };
    echarts.registerMap('HK', geoJson);
    var option = {
        tooltip: {
            trigger: 'item',
        },
        visualMap: {
            min: 0,
            max: maxCusCount,
            text: ['高', '低'],
            realtime: false,
            calculable: true,
            // inverse:true,只是高低反向
            orient: "horizontal",
            left: "center",
            bottom: "5%",
            itemWidth: 10,
            itemHeight: 100,
            inRange: {
                color: [color1, color2, color3, color4, color5]
            }
        },
        series: [{
            name: name,
            type: 'map',
            zoom: 1.2,
            mapType: 'HK', // 自定义扩展图表类型
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{b}\n{c}',
                        color: '#000',
                        textBorderColor: '#FFF',
                        textBorderWidth: 2,
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    shadowBlur: 30,
                    shadowColor: '#000',
                    shadowOffsetX: -15,
                    shadowOffsetY: 3,
                    // borderColor:'rgba(255, 255, 250,1)',
                    // borderWidth: 4,
                },
                emphasis: { 
                    label: { show: true },
                    // areaColor: 'rgba(0, 0, 0,0.1)',
                }
            },
            data: dataList,
        }]
    }
    mapChart.setOption(option);
    window.addEventListener("resize", function() {
        mapChart.resize();
    });
    mapChart.off('click');
    mapChart.on('click', function(params) {
        if (params.data == undefined) {
            return false;
        }
        // 点击显示区域的产业排名信息
        var areaText = params.name;
        var areaCode = params.data.areaCode;

        // 地图下钻
        if (cityProper[areaText]) {
            // 存储深圳 区 的信息
            if (sessionStorage.getItem("areaCode") != areaCode) {
                sessionStorage.setItem("areaCode", areaCode);
                sessionStorage.setItem("areaText", areaText);
                getIndustry();
                // 渲染地区的标签
                showLabel("#classLabelsArea1", areaText, './img/全局视图/title7.png', 'closeLabelsArea1');
            }
            getMapData(cityProper[areaText]);
        } else {
            // 存储 街道 的信息
            if (sessionStorage.getItem("areaCodeRight") != areaCode) {
                sessionStorage.setItem("areaCodeRight", areaCode);
                sessionStorage.setItem("areaTextRight", areaText);
                getIndustry();
                // 渲染街道的标签
                showLabel("#classLabelsArea2", areaText, './img/全局视图/title7.png', 'closeLabelsArea2');
            }
        }
    });
}

// 渲染labelClass标签
function showLabel(ele, text, imgUrl, idName) {
    var $classLabels = $(ele);
    $classLabels.empty();
    var $span = $("<span>").text(text).appendTo($classLabels);
    $("<img>").attr({ "src": imgUrl, 'width': '20', 'height': '22' }).prependTo($span);
    $("<img>").attr({ "src": './img/全局视图/关闭.png', 'width': '13', 'height': '13', 'id': idName }).appendTo($span);
}

// 项目库的渲染
function getCompare() {
    var value1 = 200;
    var value2 = 200;
    var text1 = (value1 / value2) * 100 + "%";
    $.get(headUrl + '&cmd=com.awspaas.user.apps.hti.portal.FootPageList', function(data) {
        var data = data.data;
        data.forEach(function(item, index) {
            if (item.TYPE == '贷款项目') {
                showCompare("pro_chart1", '#85e2e0', '#1cb0b7', text1, "占贷款总额", value1, value2);
                showCompareText(item,'#compareText1','贷款余额');
            } else if (item.TYPE == '不良项目') {
                showCompare("pro_chart2", '#e98a84', '#ac3131', text1, "占不良贷款总额", value1, value2);
                showCompareText(item,'#compareText2','不良余额');
            } else if (item.TYPE == '补偿项目') {
                showCompare("pro_chart3", '#edbe39', '#ff983f', text1, "占补偿贷款总额", value1, value2);
                showCompareText(item,'#compareText3','补偿余额');
            } else {
                showCompare("pro_chart4", '#59c1ff', '#1c97d4', text1, "占清偿贷款总额", value1, value2);
                showCompareText(item,'#compareText4','清偿余额');
            }
        })
    })
}
//渲染同比内容
function showCompareText(data,ele,text){
    var $ele = $(ele);
    $ele.empty();
    var $p1 = $("<p>").text(text+'：￥'+clearNull(data.AMOUNT)).appendTo($ele);
    $("<span>").text('圆圈').prependTo($p1);
    var $p2 = $("<p>").text('同比新增：'+clearNull(data.COMPARE)).appendTo($ele);
    $("<span>").text('圆圈').prependTo($p2);
    var $p3 = $("<p>").text('项目数量：'+clearNull(data.COUNT)).appendTo($ele);
    $("<span>").text('圆圈').prependTo($p3);
}
//去空
function clearNull(data){
    if(data){
        return data
    }else{
        return '0'
    }
} 
// 项目库环形图的渲染
function showCompare(el, color, color2, text, subtext, value1, value2) {
    var myCharts = echarts.init(document.getElementById(el));
    option = {
        title: {
            text: text,
            subtext: subtext,
            itemGap: -10,
            x: 'center',
            y: 'center',
            top: '30%',
            padding: 5,
            textStyle: {
                fontWeight: 600,
                fontSize: 16,
                color: color
            },
            subtextStyle: {
                fontWeight: 500,
                fontSize: 10,
                color: '#3c4858'
            }
        },
        // color: [color],
        series: [{
            name: '数据占比',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    textStyle: {
                        fontSize: 15,
                        color: '#00a65a'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: value1,
                    name: '',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: color // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: color2 // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                },
                {
                    value: value2,
                    name: '',
                    itemStyle: { //底层样式
                        normal: {
                            color: '#EFF0F2',
                        },
                        emphasis: { //悬浮式样式
                            color: 'rgba( 0,0,0,.1)'
                        }
                    }
                }
            ]
        }]
    };
    myCharts.setOption(option);
    window.addEventListener("resize", function() {
        myCharts.resize();
    });
}

// 显示排名的更多列表
function showMoreList(moreData,eleType){
    var numType;
    if(eleType == 0){
        numType = 'PRINCIPAL_AMOUNT';
    }else{
        numType = 'COMPANY_COUNTS';
    }
    var $ele = $('.in-storage').eq(eleType).find('.more-wrapper');
    $ele.empty();
    var $ul = $('<ul>').addClass('more-ul').appendTo($ele);
    moreData.forEach(function(item,index){
        var $li = $('<li>').attr('data-bankid',item.BANK_ID).appendTo($ul);
        if(index<3){
            $("<img>").attr('src','./img/全局视图/排名'+(index+1)+'.png').prependTo($li);
        }
        $('<span>').addClass('more-text').text(item.BANK_NAME).appendTo($li);  
        $('<span>').addClass('more-num').text(item[numType]).appendTo($li);        
    })
}