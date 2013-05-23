// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
(function($) { 
  $.fn.extend({
        // add your plugins 
        "moveModel":function(options){  
            options = $.extend({
                topWare : ".top",
                botWare : ".bottom",
                midWare : ".mid",
                lerWare : ".midw",
                btnLeft:".linel",
                btnRight:".liner",
                btnTop:".linet",
                btnBottom:".lineb",
                totalH:800,             //总高度
                topH:100,               //初始化时,上部高度
                leftW:100,              //初始化时,左部宽度
                botH:100,               //初始化时,下部高度
                rightW:100,             //初始化时,右部宽度
                minW:30,                //最小宽度
                minH:30,                //最小高度
                cookies:false,           //设置cookie下次加载按照上一次位置定位
                moving:function(){},    //移动时调用 [以下事件均返回4个参数,上左下右的数值]
                callback:function(){},  //移动结束后调用
                end:function(){},       //加载结束后调用
                before:function(){}     //加载开始前调用
            }, options ); 
            this.verion = function(a) {   //版本返回
                return "beta V0.1";
            }; 
            function debug (obj) {
                //$("h1").html(obj);
                console.log(obj);
            };
            function init () {  
                $e.height(options.totalH);
                //check cookie 
                if (options.cookies) {

                }
                $(document).on("mouseup",function(){
                    removeAllEvent();
                }); 
                $(options.btnLeft+","+options.btnRight+","+options.btnTop+","+options.btnBottom).on("mousedown",function(e){
                    console.log(e);
                    defaultXY.x = e.clientX;
                    defaultXY.y = e.clientY;
                    bindMoveEvent($(this)); 
                });  
                $(options.btnLeft+","+options.btnRight+","+options.btnTop+","+options.btnBottom).each(function(){
                    $(this)[0].addEventListener('touchstart', function(event) {
                        event.preventDefault();
                        if (event.targetTouches.length>1) {removeAllEvent();return false;}
                        var touch = event.targetTouches[0];
                        defaultXY.x = touch.pageX;
                        defaultXY.y = touch.pageY;
                        checklister($(this));
                        bindMoveEvent($(this)); 
                        MBcanmove = true; 
                    }, false);
                    $(this)[0].addEventListener('touchend', function(event) {
                        event.preventDefault();
                        removeAllEvent();
                    },false);
                });  
                $e.on("mouseleave",function(){
                    removeAllEvent();
                }); 
                options.moving(options.topH,options.leftW,options.botH,options.rightW);
            }; 
            var lister ;
            var lis_left = true;
            var lis_top = true;
            var lis_lr = true;
            var lis_Cn = 0;
            var lis_who;
            var lis_Cd ;
            var listener = function (event) {
              /* do something here */
              if (event.targetTouches.length>1) {removeAllEvent();return false;}
              var touch = event.targetTouches[0];
              debug("moving"+lis_lr+"/"+lis_left);
              if (lis_lr) {
                    var Tx = defaultXY.x - touch.pageX; 
                    if (lis_left) {
                        options.leftW = (lis_Cd+Tx*lis_Cn);
                        if (options.leftW<options.minW) {options.leftW = options.minW; return false;}
                        $(options.lerWare).css({"margin-left":(options.leftW-1)+"px"});
                        
                    }else {
                        options.rightW = (lis_Cd+Tx*lis_Cn);
                        if (options.rightW<options.minW) {options.rightW = options.minW; return false;}
                        $(options.lerWare).css({"margin-right":(options.rightW-1)+"px"});
                        
                    }
                    lis_who.css({width:(lis_Cd+Tx*lis_Cn)+"px"}); 
                }else{
                    var Ty = defaultXY.y - touch.pageY;
                    if (lis_top) {
                        if ((options.totalH - (lis_Cd+Ty*lis_Cn) - options.botH )<10) { return false; }
                        options.topH = (lis_Cd+Ty*lis_Cn);
                        if ((options.topH)<options.minH) {options.topH = options.minH; return false;}
                        $(options.topWare).css({"height":(lis_Cd+Ty*lis_Cn)+"px"});
                        $(options.midWare).css({"height":(options.totalH - options.topH - options.botH)+"px"});
                        
                    }else{
                        if ((options.totalH - options.topH - (lis_Cd+Ty*lis_Cn) )<10) { return false; }
                        options.botH = (lis_Cd+Ty*lis_Cn);
                        if ((options.botH)<options.minH) {options.botH = options.minH; return false;}
                        $(options.botWare).css({"height":(lis_Cd+Ty*lis_Cn)+"px"});
                        $(options.midWare).css({"height":(options.totalH - options.topH - options.botH)+"px"});
                        
                    }
                }
                options.moving(options.topH,options.leftW,options.botH,options.rightW);

            };
            function checklister(o) {
                if (o.is(options.btnLeft)) {
                    lis_Cn = 1; 
                    lis_lr = true; 
                    lis_Cd = options.rightW; 
                    lis_left = false; 
                    lis_top=false;
                    lis_who = $(options.btnLeft).parent();
                }else if(o.is(options.btnRight)) {
                    lis_Cn = -1; 
                    lis_lr = true; 
                    lis_Cd = options.leftW; 
                    lis_left = true; 
                    lis_top=false;
                    lis_who = $(options.btnRight).parent();
                }else if (o.is(options.btnTop)) {
                    lis_Cn = 1; 
                    lis_lr = false; 
                    lis_Cd = options.botH; 
                    lis_left = false;
                    lis_top=false;
                    lis_who = $(options.btnTop).parent();
                }else if (o.is(options.btnBottom)) {
                    lis_Cn = -1; 
                    lis_lr = false; 
                    lis_Cd = options.topH; 
                    lis_left = false;
                    lis_top=true;
                    lis_who = $(options.btnBottom).parent(); 
                }else{
                    removeAllEvent();
                    return false;
                }  
            }
            function bindMoveEvent(o) { 
                var Cn=0;
                var lr = true;
                var left = true;
                var top = true;
                var who ;
                var Cd ;
                if (o.is(options.btnLeft)) {
                    Cn = 1; Cd = options.rightW; left = false; 
                    who = $(options.btnLeft).parent();
                }else if(o.is(options.btnRight)) {
                    Cn = -1; Cd = options.leftW; left = true; 
                    who = $(options.btnRight).parent();
                }else if (o.is(options.btnTop)) {
                    Cn = 1; lr = false; Cd = options.botH; top=false;
                    who = $(options.btnTop).parent();
                }else if (o.is(options.btnBottom)) {
                    Cn = -1; lr = false; Cd = options.topH;
                    who = $(options.btnBottom).parent(); top=true;
                }else{
                    removeAllEvent();
                    return false;
                }  
                window.addEventListener("touchmove",listener,false); 
                $(document).on("mousemove",function(e){
                    if (lr) {
                        var Tx = defaultXY.x - e.clientX; 
                        if (left) {
                            options.leftW = (Cd+Tx*Cn);
                            if (options.leftW<options.minW) {options.leftW = options.minW; return false;}
                            $(options.lerWare).css({"margin-left":(Cd+Tx*Cn)+"px"});
                            
                        }else {
                            options.rightW = (Cd+Tx*Cn);
                            if (options.rightW<options.minW) {options.rightW = options.minW; return false;}
                            $(options.lerWare).css({"margin-right":(Cd+Tx*Cn)+"px"});
                            
                        }
                        who.css({width:(Cd+Tx*Cn)+"px"}); 
                    }else{
                        var Ty = defaultXY.y - e.clientY;
                        if (top) {
                            if ((options.totalH - (Cd+Ty*Cn) - options.botH )<10) { return false; }
                            options.topH = (Cd+Ty*Cn);
                            if ((options.topH)<options.minH) {options.topH = options.minH; return false;}
                            $(options.topWare).css({"height":(Cd+Ty*Cn)+"px"});
                            $(options.midWare).css({"height":(options.totalH - options.topH - options.botH)+"px"});
                            
                        }else{
                            if ((options.totalH - options.topH - (Cd+Ty*Cn) )<10) { return false; }
                            options.botH = (Cd+Ty*Cn);
                            if ((options.botH)<options.minH) {options.botH = options.minH; return false;}
                            $(options.botWare).css({"height":(Cd+Ty*Cn)+"px"});
                            $(options.midWare).css({"height":(options.totalH - options.topH - options.botH)+"px"});
                            
                        }
                    }
                    options.moving(options.topH,options.leftW,options.botH,options.rightW);
                });
            }

            function removeAllEvent() {  
                debug("3");
                window.removeEventListener("touchmove",listener,false);
                $(document).off("mousemove");
                // when move over , call here.
                options.callback(options.topH,options.leftW,options.botH,options.rightW);
            }
            //初始化 
            var $e = $(this);
            var defaultXY ={};
            init();
            return this;
        } 
    }); 
})(jQuery); 
// Place any jQuery/helper plugins in here.
