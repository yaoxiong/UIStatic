define('baseObject', ['jquery'], function(require, exports, module) {

    var $ = require('jquery');

    var ruleList = require('ruleList');

    function runRules() {

        for (var i = 0; i < ruleList.length; i++) {
            ruleList[i]();
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
            val = that["__" + protoN + "__" + "callBack"]();
        }

        // 把值赋值到标签里
        setVal(val, protoElem);
        that["__" + protoN + "__"] = val;

        if (!that["__" + protoN + "__" + "callBack"]) {

            runRules();
        }

    }

    module.exports = {

        runRules: function(){

            for (var i = 0; i < ruleList.length; i++) {
                ruleList[i]();
            }
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

            // $("base").attr("href", "html" + key + "/");
            $("#page").html(data);

        },

        // 监听标签 标签值绑定到属性
        /**
            暂时只能能监听用户修改了页面数据
        */
        watchElement: function(parent, protoN, protoElem){

            protoElem.on('change', function(e){
                var val;

                // 根据设置来判断值是哪里的
                // 目前支持三种值获取方式
                // 第一 checked
                // 第二 text
                // 第三 value
                switch($(this).attr("data-value"))
                {
                    case 'checked':
                        val = $(this).prop("checked");
                        break;
                    case 'text':
                        val = $(this).text();
                        break;
                    case 'value':
                        val = $(this).val();
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
