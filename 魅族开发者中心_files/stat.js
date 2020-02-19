    var __mztj = {
        unload: true
    };
    var MeizuBH = function(){};
    (function() {
        var ga = document.createElement('script'), s;
        ga.type = 'text/javascript';
        ga.src = 'https://tongji-res.meizu.com/resources/tongji/flow.js';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();

var MZ_stat = {
    init:function(){
        this.bindEvent();
    },
    bindEvent:function(){
        var self = this;

        $('#table').on('click','.J_put_away',function(e){
            self.report('click_sale_theme')     //点击申请上架
        }).on('click','.J_applySold',function(e){
            self.report('click_off_theme')      //点击申请下架
        }).on('click','.J_revocation',function(e){
            self.report('click_repeal_audit_theme')   //点击撤销审核
        }).on('click','.coment-detail',function(e){
            self.report('click_theme_score')
        });

        $('#queryByCondition').on('click',function(e){
            self.report('click_theme_score_check')   //点击积分查询
        })

        $('.down_tpl').on('click',function(){
            if($(this).attr('id')!='download'){
                self.report('click_load_templates');    //点击下载模板
            }
        })

        $('#material5').find('.uploadfilebtn').on('click',function(){
            self.report('click_upload_flyme5');     //点击上传flyme5素材包
        });
        $('#material4').find('.uploadfilebtn').on('click',function(){
            self.report('click_upload_flyme4');     //点击上传flyme4素材包
        });

        $("#publish").on("click",function(){
            self.report('click_release_theme_2')  //上传完成后点击发布
        });
    },
    report:function(event,extParams){
        var self = this;
        var params = {};
        params.user_id = self.getUserId();
        if(extParams){
            params = $.extend(params, extParams);
        }
        params = $.param(params);
        if(event.indexOf('load_')==0){  //页面loaded事件上报
            setTimeout(function(){
                MeizuBH("action="+event+"&"+params);
            },200);
        }else{
            MeizuBH("action="+event+"&"+params);
        }
    },
    getUserId:function(){
        return this.getCookie('uid');
    },
    getCookie:function(c_name){
        if (document.cookie.length>0){
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1){
                c_start=c_start + c_name.length+1;
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return ""
    }
}
$(function(){
    MZ_stat.init();
});
