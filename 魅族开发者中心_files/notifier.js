$(function(){
    var interval = void 0;
    initNotifier();
    bindEvents();

    function initNotifier(){
        var $notifier = $('<div>').addClass('notifier');
        $('.notifier').remove();
        $('.mz_content2').append($notifier);

        var jQobj = window['JAlertGetContent']('alert');
        //重置 jAlert 的样式，详情请看源码
        window.JQAlert.alert = jQobj.mzDialog(
            {
                'nohide': true,
                'width': 540,
                'height': 240,
                'closeBtn': function(){
                    window.clearInterval(interval);
                }
            });

        checkTaskExist().then(toggleNotifier);
    }

    function checkTaskExist(){
        return $.ajax({
            url: '/console/theme/tasks/exist',
            type: 'GET',
            dataType: 'json'
        });
    }

    function toggleNotifier(resp){
        if(resp.code == 200){
            $('.notifier').toggleClass('show', resp.value.jobs_exists);
            $('.notifier').toggleClass('hasUnreadJobs', resp.value.unread_jobs_exists);
        }
        else{
            console.info(resp);
        }
    }

    function bindEvents(){

        $('.mz_content2').on('click', '.notifier', function(){
            $.get('/console/theme/tasks',function(result){
                if(result.code == 200) {
                    showTaskList(result.value);
                    showPackingProgress(result.value.packing);
                    setMessagesRead(result.value);
                }else{
                    jAlert("获取消息任务失败，请重新刷新页面再试！", "提示");
                }
            });
        });

        $(document).on('click', '.J_failedor', function(){
            var id = $(this).attr("data-id");
            $.get("/console/theme/failed_task/delete?id="+id,function(result){
                var code = result.code;
                if(code == 200){
                    location.href ='http://designer.meizu.com/console/theme';
                }else{
                    jAlert("跳转到重新上传页面出错", "提示");
                }
            });
        });
    }

    function showTaskList(data){
        if(data.packing.length || data.failed.length || data.successful.length){
            jAlert(packingFun(data.packing) + successfulFun(data.successful) + failedFun(data.failed), "提示", function(){
                window.clearInterval(interval);
            });
            adjustStyle();
        }
    }

    //正在打包的
    function packingFun(data){

        if(data.length == 0){
            return '';
        }
        var list = ["<div class='packingTitle'>正在打包:</div>"];
        data.forEach(function(item, index){
            list.push("<div class='content_message'> \
                                <a href='javascript:void(0);'>" + (index+1) + "、" + item.themeName + "（ " + item.packageName + "）</a>" +
                            "</div> \
                            <div class='proStyle'> \
                                <progress max='100'><ie class='ieStyle ieStyle1' width='300px'></ie></progress> \
                                &nbsp;<span id='progress1' >正在加载进度...</span>\
                            </div>");
        });
        return list.join('');
    }

    //已经完成的包
    function successfulFun(data){
        if(data.length == 0){
            return '';
        }
        var list = ["<div class='packingTitle'>打包成功:</div>"];
        data.forEach(function(item, index){
            list.push("<div class='content_message'> \
                        <a href='"+ item.messageRedirectUrl +"'>" + (index+1) + "、" + item.themeName + "（ " + item.packageName + "）</a>" +
                    "</div>");
        });
        return list.join('');
    }

    //出错的包
    function failedFun(data){
        if(data.length == 0){
            return '';
        }
        var packingList = "<div class='packingTitle'>打包失败：</div>";
        $.each(data,function(i, err) {
			var errors = JSON.parse(err.message)['error'],
			    aLink = '<a href="javascript:void 0;" class="content_meg">  '+ err.themeName +'主题('+ err.packageName +') 打包出错： ';
            $.each(errors, function(index, item){
				aLink += (index + 1) + '. ' + item + ' ';
            });
            aLink += '；</a>'

			packingList = packingList + "<div class='content_message1 J_failedor' data-id='"+err.id+"'>" + (i + 1) + '、 ' + aLink + "</div>";
		});
        return packingList;
    }

    function adjustStyle(){
        var $mzAlertAlert = $('#mzAlert_alert');
        var _height = $mzAlertAlert.find('.alert_message').innerHeight();
        if(parseInt(_height) >= 400){
            $mzAlertAlert.css("padding-right",'0');
            $mzAlertAlert.find('.alert_message').css({
                "max-height":"400px",
                "overflow-y":"scroll"
            });
            $mzAlertAlert.find('.part2').css({
                "position":"relative",
                "bottom":"-25px",
                "left":"-20px"
            });
            $mzAlertAlert.find('.alert_title').css({
                "position":"relative",
                "left":"-25px"
            });
        }
        $mzAlertAlert.parent().css("height",$mzAlertAlert.innerHeight());
    }

    function showPackingProgress(packingList){
        if (packingList.length != 0) {
            //目前正在打包的任务最多只有一个
            var firstPacking = packingList[0];
            pushProgress(firstPacking.packageName,firstPacking.themeName,firstPacking.packageOs);
        }
    }

    function pushProgress(packageName,themeName,packageOs){
        interval = setInterval(function(){
            $.get("/console/theme/make/progress",$.param({"package_name":packageName, "package_os": packageOs}),function(result){
                var progress = result.value;
                if(result.code == 200){
                    if(progress != ''){
                        $('progress').val(parseFloat(progress).toFixed(1));
                        $('#progress1').text(parseFloat(progress).toFixed(1) + "%");
                        $('.ieStyle1').css('width',progress+ "%");
                    } else {
                    	window.clearInterval(interval);
                        window.JQAlert.alert.close();
                    	$.get("/console/theme/make/done",$.param({"package_name":packageName, "package_os": packageOs}),function(result){
                            if(result.code=='200'){
                                window.jConfirm('已成功打包，要现在发布吗？','提示', function(confirm){
                                    confirm && (location.href = "/console/themes/publish?package_name=" + packageName + '&package_os=' + packageOs);
                                });
                            } else {
                                messageInfo(result);
                    			$("#mzAlert_alert .alert_message").css('overflow','hidden');
                    		}
                    	});
                    }
                }

            });
        },300);

    }
    
    function messageInfo(result){
        var jQobj = window['JAlertGetContent']('alert');
        //重置 jAlert 的样式，详情请看源码
        window.JQAlert.alert = jQobj.mzDialog(
            {
                'nohide': true,
                'width': 540,
                'height': 240,
                'closeBtn': false
            });
        
        var tpl;
        if(result.code == '113011'){
            tpl = JSON.parse(resp.message).error.map(function(item, index){
                return '<p>' + (index + 1) + '、 ' + item + '<p>';
            });
        } else {
            tpl = '服务器繁忙，请重试';
        }
        jAlert(tpl,"出错了");
        $('.part2').html("<div class='repeatUpload'><a href='http://designer.meizu.com/console/theme' class='m_pureBlue_a mzBtnwh2 m_btn1 radius1'>重新上传</a></div>");
    }

    function setMessagesRead(data){
        $.ajax({
            url: '/console/theme/task/set_message_read',
            type: 'POST',
            dataType: 'json',
            data: {
                ids: getMsgIds(data)
            },
            success: function(resp){
                if(resp.code == 200){
                    $('.notifier').removeClass('hasUnreadJobs');
                } else {
                    console.info(resp);
                }
            }
        });

        function getMsgIds(data){
            var ids = [];
            $.each(data, function(key, value){
                $.each(value, function(_,item){
                    ids.push(item.id);
                });
            });
            return ids.join(',');
        }
    }
});