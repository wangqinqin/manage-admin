import $ from 'jquery';
import './simplePage.css';
(function($){
    var ms = {
        init:function(obj,args){
            return (function(){
                ms.fillHtml(obj,args);
                ms.bindEvent(obj,args);
            })();
        },
        //填充html
        fillHtml:function(obj,args){
            return (function(){
                obj.empty();
                if(!obj.hasClass('simple-page')){
                    obj.addClass('simple-page');
                }
                if(obj.prev().hasClass('wrap-table')){
                    if(!obj.prev().hasClass('simple-page-pre-wrap')){
                        obj.prev().wrap('<div class="simple-page-pre-wrap"></div>');
                        obj.prev().prepend('<span class="simplePagePre"></span>');
                        obj.prev().append('<span class="simplePageNext"></span>');
                    }
                }
                obj.append('<span id="'+ obj.attr('id') +'-pageLoading" class="simple-page-loading"><i class="fa fa-spinner fa-pulse"></i>数据加载中...</span>');
                //上一页
                if(args.current > 1){
                    obj.append('<a href="javascript:;" class="prevPage"><i class="fa fa-angle-left pre-page-icon"></i></a>');
                }else{
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled"><i class="fa fa-angle-left pre-page-icon"></i></span>');
                }
                //中间页码
                if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
                }
                if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
                    obj.append('<span>...</span>');
                }
                var start = args.current -2,end = args.current+2;
                if((start > 1 && args.current < 4)||args.current == 1){
                    end++;
                }
                if(args.current > args.pageCount-4 && args.current >= args.pageCount){
                    start--;
                }
                for (;start <= end; start++) {
                    if(start <= args.pageCount && start >= 1){
                        if(start != args.current){
                            obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
                        }else{
                            obj.append('<span class="current">'+ start +'</span>');
                        }
                    }
                }
                if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
                    obj.append('<span>...</span>');
                }
                if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
                }
                //下一页
                if(args.current < args.pageCount){
                    obj.append('<a href="javascript:;" class="nextPage"><i class="fa fa-angle-right next-page-icon"></i></a>');
                }else{
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled"><i class="fa fa-angle-right next-page-icon"></i></span>');
                }
                obj.append('<span>共 '+ args.pageCount +' 页</span>');
                if(args.isJump){
                    obj.append('<input type="text" class="page-input" /><a href="javascript:;" class="page-jump-btn">GO</a>');
                }
            })();
        },
        //绑定事件
        bindEvent:function(obj,args){
            return (function(){
                obj.off("click","a.tcdNumber").on("click","a.tcdNumber",function(){
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,"isJump":args.isJump});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });
                //上一页
                obj.off("click","a.prevPage").on("click","a.prevPage",function(){
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount,"isJump":args.isJump});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current-1);
                    }
                });
                //下一页
                obj.off("click","a.nextPage").on("click","a.nextPage",function(){
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount,"isJump":args.isJump});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current+1);
                    }
                });
                if(obj.prev().hasClass('simple-page-pre-wrap')){
                    obj.prev().off("click","span.simplePagePre").on("click","span.simplePagePre",function () {
                        var current = parseInt(obj.children("span.current").text());
                        if(current==1) return;
                        ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount,"isJump":args.isJump});
                        if(typeof(args.backFn)=="function"){
                            args.backFn(current-1);
                        }
                    });
                    obj.prev().off("click","span.simplePageNext").on("click","span.simplePageNext",function () {
                        var current = parseInt(obj.children("span.current").text());
                        if(current==args.pageCount) return;
                        ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount,"isJump":args.isJump});
                        if(typeof(args.backFn)=="function"){
                            args.backFn(current+1);
                        }
                    });
                }
                if(args.isJump){
                    obj.off("click","a.page-jump-btn").on("click","a.page-jump-btn",function(){
                        var _current = parseInt(obj.children("input.page-input").val());
                        if(isNaN(_current)) return;
                        var current = parseInt(obj.children("span.current").text());
                        if(_current < 1) _current=1;
                        else if(_current > args.pageCount) _current = args.pageCount;
                        else if(_current == current) return;
                        current = _current;
                        ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,"isJump":args.isJump});
                        if(typeof(args.backFn)=="function"){
                            args.backFn(current);
                        }
                    });
                    obj.off("keydown","input.page-input").on("keydown","input.page-input",function(event){
                        if(event.keyCode == 13){
                            var _current = parseInt(obj.children("input.page-input").val());
                            if(isNaN(_current)) return;
                            var current = parseInt(obj.children("span.current").text());
                            if(_current < 1) _current=1;
                            else if(_current > args.pageCount) _current = args.pageCount;
                            else if(_current == current) return;
                            current = _current;
                            ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,"isJump":args.isJump});
                            if(typeof(args.backFn)=="function"){
                                args.backFn(current);
                            }
                        }
                    });
                }
            })();
        }
    };
    // $.fn.createPage = function(options){
    //     var args = $.extend({
    //         pageCount : 10,
    //         current : 1,
    //         backFn : function(){}
    //     },options);
    //     ms.init(this,args);
    // }
    window.CreatePage = function(options){
        var args = $.extend({
            pageCount : 10,
            current : 1,
            backFn : function(){}
        },options);
        ms.init($('#'+options.id),args);
    }
})($);

module.exports  = CreatePage;