define('baseObject', ['jquery', 'scope'], function(require, exports, module) {

    var $ = require('jquery');

    var scope = require('scope');

    var ruleList = require('ruleList');

    function runRules() {

        for (var i = 0; i < ruleList.length; i++) {
            // try{
                ruleList[i]();
            // }catch(e) {

            // }
        }
    }

    // 重写js对象属性get方法
    function getValue(that, protoN) {
        return that["__" + protoN + "__"];
    }

    // 重写js对象set方法
    function setValue(that, protoN, setVal, val, protoElem) {

        // 当需要自己设置规则的时候就调用回调方法
        if (that["__" + protoN + "__" + "callBack"]) {
            val = that["__" + protoN + "__" + "callBack"](val);
        }

        // 把值赋值到标签里
        setVal(val, protoElem);
        that["__" + protoN + "__"] = val;

        if (!that["__" + protoN + "__" + "callBack"]) {

            runRules();
        }

    }

    module.exports = {
        ajaxWrap: function(data, sucss, fail){
            $.ajax(data).then(function(data) {
                if (sucss) {
                    sucss(data);
                };
            }, function(err) {
                if (fail) {
                    fail(err);
                };
            });
        },
        // 倒计时
        countdown: function(el, opt){
            opt = $.extend({
                start: 60,
                secondOnly: false,
                callback: null
            }, opt || {});
            var t = opt.start;
            var sec = opt.secondOnly;
            var fn = opt.callback;
            var d = +new Date();
            var diff = Math.round((d + t*1000) /1000);
            return timeout(el, diff, fn);

            function timeout(elem, until, fn) {
                var str = '',
                    started = false,
                    left = {d: 0, h: 0, m: 0, s: 0, t: 0},
                    current = Math.round(+new Date() / 1000),
                    data = {d: '天', h: '时', m: '分', s: '秒'};

                left.s = until - current;

                if (left.s <= 0) {
                    (typeof fn === 'function') && fn();
                    return;
                }
                if(!sec) {
                    if (Math.floor(left.s / 86400) > 0) {
                      left.d = Math.floor(left.s / 86400);
                      left.s = left.s % 86400;
                      str += left.d + data.d;
                      started = true;
                    }
                    if (Math.floor(left.s / 3600) > 0) {
                      left.h = Math.floor(left.s / 3600);
                      left.s = left.s % 3600;
                      started = true;
                    }
                }
                if (started) {
                  str += ' ' + left.h + data.h;
                  started = true;
                }
                if(!sec) {
                    if (Math.floor(left.s / 60) > 0) {
                      left.m = Math.floor(left.s / 60);
                      left.s = left.s % 60;
                      started = true;
                    }
                }
                if (started) {
                  str += ' ' + left.m + data.m;
                  started = true;
                }
                if (Math.floor(left.s) > 0) {
                  started = true;
                }
                if (started) {
                  str += ' ' + left.s + data.s;
                  started = true;
                }
                elem.innerHTML = str;
                return setTimeout(function() {timeout(elem, until,fn);}, 1000);
            }
        },

        getLocation: function(sucss, fail, isenableHighAccuracy) {
            var that = this;
                        scope["position"] = {
                            longitude: '',
                            latitude: ''
                        };
            if (!scope["position"]) {
                if (arguments.length < 3) {
                    isenableHighAccuracy = true;
                };
                var options = {
                    enableHighAccuracy: isenableHighAccuracy
                };
                if (window.navigator.geolocation) {
                    window.navigator.geolocation.getCurrentPosition(function(position) {
                        scope["position"] = {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude
                        };
                        that.getNearbyShops(scope["position"], sucss, fail);
                    }, function(err){
                        scope["position"] = {
                            longitude: '',
                            latitude: ''
                        };
                        that.getNearbyShops(scope["position"], sucss, fail);
                    }, options);
                };

            } else {
                that.getNearbyShops(scope["position"], sucss, fail);
            }
        },

        getNearbyShops: function(position, sucss, fail) {
            this.ajaxWrap({
                type: 'post',
                url: globleURL.getLocation,
                data: position
            },function(data) {
                data =JSON.parse(data);
                sucss(data);
            },function(err){
                fail(err);
            });
        },

        runRules: function(){
            runRules();
        },

        // 获得数据对象
        getDataObject : function(html, DObject) {

            var that = this;

            var dataObject = {};

            // 获得所有的自定义数组
            var arrayList = $(html).find("[data-array]");

            for (var i = 0; i < arrayList.length; i++) {
                var currentElem = $(arrayList[i]);
                dataObject[currentElem.attr("data-array")] = [];
            };

            // 获得所有的自定义对象
            var objectList = $(html).find("[data-object]");

            // 通过循环把所有的自定义对象标签转换为对象
            for (var i = 0; i < objectList.length; i++) {

                // 获得当前标签对象
                var currentElem = $(objectList[i]);

                // 对象的名字
                dataObject[currentElem.attr("data-object")] = new DObject(currentElem);

                // 获得当前对象上级数组对象
                var parentObject = $(objectList[i]).parent().closest("[data-object]");
                var parentArray = $(objectList[i]).closest("[data-array]");

                // 如果父对象是数组
                (parentArray.length && parentObject.length < 1) || (parentArray.length && parentObject.length && parentObject.find(parentArray).length) ?  function(dataObject, parentArray, current) {

                    // 首先建立一个数组对象
                    dataObject[parentArray.attr("data-array")] = dataObject[parentArray.attr("data-array")] ? dataObject[parentArray.attr("data-array")] : [];

                    // 然后把当前对象放到数组里
                    dataObject[parentArray.attr("data-array")][dataObject[parentArray.attr("data-array")].length] = current;

                    // 然后把数组放到父对象里
                    var arrParent = parentArray.closest("[data-object]");
                    if(arrParent.length) {
                        dataObject[arrParent.attr("data-object")][parentArray.attr("data-array")] = dataObject[parentArray.attr("data-array")];
                    }

                }(dataObject, parentArray, dataObject[currentElem.attr("data-object")]) : null;

                // 如果父对象是对象
                (parentObject.length && parentArray.length < 1) || (parentArray.length && parentObject.length && parentArray.find(parentObject).length) ? function(parent, currentN, current) {
                    parent[currentN] = current;
                }(dataObject[parentObject.attr("data-object")], currentElem.attr("data-object"), dataObject[currentElem.attr("data-object")]) : null;

                // 让对象有对应的层级关系
                // $.extend(dataObject[currentElem.attr("data-object")], that.getDataObject(currentElem, DObject));

            }

            return dataObject;
        },

        // 填充页面
        setPage: function(key, data) {
            // 初始化每个页面，避免由于跨页带来的不必要的影响
            (function reset(){
                var $body = $(document.body);
                if(!(scope.noScrollTop && scope.noScrollTop === true)){
                    // 跳转页面顶部
                    $body.scrollTop(0);
                }
                scope.noScrollTop = false;

                // 取消上个页面的绑定事件
                $body.off('click');
                // 清空之前页面的定时器
                $.each(scope.timeId,function(index,item){
                    clearTimeout(item);
                });
                scope.timeId = [];
            })();
            $("#page").html(data);
        },

        // 监听标签 标签值绑定到属性
        /**
            暂时只能能监听用户修改了页面数据
        */
        watchElement: function(parent, protoN, protoElem){

            protoElem.elem.on('change', function(e){
                var val;

                // 根据设置来判断值是哪里的
                // 目前支持四种值获取方式
                // 第一 checked
                // 第二 text
                // 第三 value
                // 第四 file
                switch($(this).attr("data-value"))
                {
                    case 'checked':
                        val = $(this).prop("checked");
                        break;
                    case 'text':
                        val = $(this).text().trim();
                        break;
                    case 'value':
                        val = $(this).val();
                        break;
                    case 'img':
                        val = {
                            src: $(this).attr("src"),
                            alt: $(this).attr("alt")
                        };
                        break;
                    case 'file':
                        var files = $(this).prop('files');
                        var reader = new FileReader();
                        reader.readAsDataURL(files[0]);
                        reader.onload = function(evt){
                            var fileString = evt.target.result;
                            val = fileString;
                            protoElem.callBack(fileString);
                            parent["__" + protoN + "__"] = val;
                        }
                        break;
                    default: // todo 待完善
                        break;
                }
                parent[protoN] = val;
            });
        },

        // 监听属性 属性绑定到标签
        watchProperty: function(parent, protoN, protoElem, setVal) {

            // 监听数据来操作标签
            /**
                监听属性的修改和添加
        ******************************************
                Desktop
                    Chrome 5+
                    Firefox (Gecko) 4.0 (2)+
                    Internet Explorer 9 [1]+
                    Opera 11.60+
                    Safari 5.1 [2]+
        ******************************************
                Mobile
                    Android yes
                    Firefox Mobile (Gecko) 4.0 (2)+
                    IE Mobile 9+
                    Opera Mobile 11.5+
                    Safari Mobile yes
            */
            if (Object.defineProperty) {
                Object.defineProperty(parent, protoN, {
                    get : function() {
                        return getValue(this, protoN);
                    },
                    set : function(val) {
                        setValue(this, protoN, setVal, val, protoElem);
                    }
                });
            }

            /**
                监听属性的修改和添加 已经废弃，不过兼容还不错
        ******************************************
                Desktop
                    Chrome (Yes)
                    Firefox (Gecko) (Yes)
                    Internet Explorer 11+
                    Opera (Yes)
                    Safari 5.1 (Yes)
        ******************************************
                Mobile
                    Android yes
                    Firefox Mobile (Gecko) (Yes)
                    IE Mobile ?
                    Opera Mobile (Yes)
                    Safari Mobile yes
            */

            else if (parent.__defineSetter__ && parent.__defineGetter__) {

                // 返回值
                parent.__defineGetter__(protoN, function() {

                    return getValue(this, protoN);
                });

                // 设置值
                parent.__defineSetter__(protoN, function(val) {
                    setValue(this, protoN, setVal, val, protoElem);
                });
            }

        }
    };
});
