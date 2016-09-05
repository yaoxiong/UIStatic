define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');

    var template = require('template');

    var handleTransitionEndEvent = function($elem,fn){
        function whichTransitionEvent(){  
            var t;  
            var el = document.createElement('fakeelement');  
            var transitions = {  
              'transition':'transitionend',  
              'OTransition':'oTransitionEnd',  
              'MozTransition':'transitionend',  
              'WebkitTransition':'webkitTransitionEnd',  
              'MsTransition':'msTransitionEnd'  
            };
            for(t in transitions){  
                if( el.style[t] !== undefined ){  
                    return transitions[t];
                }  
            }  
        }
        var flag = false;
        var transEndEventName = whichTransitionEvent();
        var callback = function(e){
            if(!flag){
                fn(e);
                flag = true;
            }
        };
        $elem.on(transEndEventName,callback);
    };
    module.exports = {
        init: function() {
            domObject.doit('/member/footprint', function(elem, object, setRule) {
                var footprint;
                function init(){
                    var data = {};
                    footprint = localStorage.getItem('footprint');
                    try{
                        footprint = JSON.parse(footprint);
                        if(!footprint.length){
                            elem.footprint.empty.addClass('show');return;
                        }
                        data.list = format(footprint);
                        var html = template('tmplFootprint', data);
                        elem.footprint.timeline.html(html);
                    }catch(e){
                        elem.footprint.empty.addClass('show');
                        return;
                    }
                }
                function format(footprint){
                    var obj = [];
                    if(!footprint.length) return;
                    $.each(footprint,function(index,item){
                        var date = new Date(item.date);
                        var month = date.getMonth();
                        var day = date.getDate()-1;
                        if(obj[month]){
                            if(obj[month][day]){
                                obj[month][day].push(item);
                            }else{
                                obj[month][day] = [item];
                            }
                        }else{
                            obj[month] = [];
                            obj[month][day] = [item];
                        }
                    });
                    obj.reverse();
                    $.each(obj,function(index,item){
                        if(item)
                            item.reverse();
                    });
                    return obj;
                }
                init();
                function del_footprint($ele,callback){
                    if($ele.hasClass('timeline')){
                        elem.confirm.open('确定清空吗？',function(){
                            $ele.empty();
                            elem.footprint.empty.addClass('show');
                            localStorage.removeItem('footprint');
                        });
                    }else{
                        elem.confirm.open('确定删除吗？',function(){
                            var $timelineUnit = $ele.closest('.timeline-item');
                            var $timelineHeader = $timelineUnit.find('.timeline-item-header');
                            var id = $timelineUnit.attr('data-goodId');
                            footprint.splice(footprint.indexOf(id),1);
                            localStorage.setItem('footprint',JSON.stringify(footprint));
                            var length = $ele.siblings().length;
                            $ele.addClass('remove');

                            handleTransitionEndEvent($ele.find('.goods-item-main'),function(e){
                                $ele.remove();
                                if(length === 0){
                                    $timelineHeader.addClass('remove');
                                }
                            });
                            handleTransitionEndEvent($timelineHeader,function(e){
                                $timelineUnit.remove();
                                var len = elem.footprint.timeline.find('.timeline-item').length;
                                if(!len){
                                    elem.footprint.empty.addClass('show');
                                }
                            });
                        });
                    }
                }
                $('.btn-delete').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var $unit = $(this).closest('.goods-item');
                    del_footprint($unit);
                });
                elem.clearAll.on('click',function(){
                    del_footprint($('.timeline'));
                });
            });
        }
    };
});