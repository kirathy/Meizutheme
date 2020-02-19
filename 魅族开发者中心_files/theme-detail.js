/**
 * Created with JetBrains WebStorm.
 * User: zhouyi
 * Date: 13-7-3
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */
var detail = {
    init: function () {
        var self = this;
    	$('#back').bind('click',function(){
    		var backUrl = '/console/apps/app/list?t='+new Date().getTime();
    		if( catid == 2 ){
    			backUrl = '/console/apps/game/list?t='+new Date().getTime();
    		} else if( catid == 5 ){
    			backUrl = '/console/themes/list?t='+new Date().getTime();
    		}
    		window.open( backUrl,'_self' );
    	});
    	
    	$('#downFile').bind('click',function(){
    			$.getJSON('/console/themes/get_download_urls', {'verId': verid}, function (result) {
                    if (null == result || null == result.value) {
                        self.downloadFile(downloadUrl);
                            return;
                        }
                    $("iframe").remove();
                        for(var i=0;i<result.value.length;i++){
                           // window.open( result.value[i]);
                            self.downloadFile(result.value[i]);
                        }
//                    if(isSafari=navigator.userAgent.indexOf("Safari")>0) {
//                        if (null == result || null == result.value) {
//                            window.location.href = downloadUrl ;
//                            return;
//                        }
//                        for(var i=0;i<result.value.length;i++){
//                            window.open( result.value[i]);
//                        }
//                    }else{
//                        if (null == result || null == result.value) {
//                            window.open( downloadUrl);
//                            return;
//                        }
//                        for(var i=0;i<result.value.length;i++){
//                            window.open( result.value[i]);
//                        }
//                    }
    	        });
    	});
        $(".wrap").delegate(".promotion_price.mz_warning","mouseenter",function(){
            var promotionTime = $(this).attr("data-themepromotiontime");
            var div1 = '<div id="promotionPrice_detail">' + promotionTime +'</div>';
            $(this).parent().addClass("promotionPrice_dl");
            $(".promotionPrice_dl").parent().addClass("promotionPrice_div");
            $(".promotionPrice_div").after(div1);
        }).delegate(".promotion_price.mz_warning","mouseout",function(){
                $(this).parent().removeClass("promotionPrice_dl");
                $(this).parents().removeClass("promotionPrice_div");
                $("#promotionPrice_detail").remove();
            });
    },
    downloadFile: function (src) {
        var iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    },
bindEvents: function () {
        var $appDes = $("#appDes");
        var $appDesText = $appDes.children("p");
        var appDesText = $appDesText.html();
        var appDesLen = appDesText.length;
        if (appDesLen > 170) {
            $appDesText.html(appDesText.substr(0, 170) + "......").after("<a href='javascript:;' data-status='fold' class='more' id='more'>更多</a>");
            $appDes.delegate("#more", "click", function () {
                var status = $(this).attr("data-status");
                if (status == "fold") {
                    $(this).html("收起").attr("data-status", "unfold");
                    $appDesText.html(appDesText);
                } else if (status == "unfold") {
                    $(this).html("更多").attr("data-status", "fold");
                    $appDesText.html(appDesText.substr(0, 170) + "......");
                }
            });
        }

    }/*,
     bindEvents: function () {
     var $filter = $("#project_filter"),
     $container = $("#project_list");
     $filter.find('li').click(function () {
     var selector = $(this).attr('data-filter');
     $filter.find('li').removeClass("mz_current");
     $filter.find('.i_current').remove();
     $(this).addClass('mz_current');
     $(this).append('<i class="i_current"></i>');
     $container.find("li").hide().filter(selector).show();
     return false;
     });
     }*/

};
$(function () {
    detail.init();
});