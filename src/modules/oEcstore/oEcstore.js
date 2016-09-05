define('oEcstore', ['jquery', 'ElemtObject', 'DataObject', 'baseObject', 'ruleList', 'components', 'scope'], function(require, exports, module) {

    // 通过 require 引入依赖
    // require('flexible');
    var $ = require('jquery');

    // 标签对象
    var ElemtObject = require('ElemtObject');

    // 数据对象
    var DataObject = require('DataObject');

    // 工具模块
    var baseObject = require('baseObject');

    // 规则列表
    var ruleList = require('ruleList');

    // 插件对象
    var components = require('components');

    var scope = require('scope');


    module.exports = {
        // 插入html
        html: function(elem, html) {
            elem.html(html);
            this.render();
        },

        // 删除对象
        remove: function(elem) {

            elem.remove();
            this.render();
        },

        // 添加对象
        append: function(elem, html) {
            elem.append(html);
            this.render();
        },

        // 重画页面
        render: function() {

            var dataObject = this.getData($("#page"));
            var object = dataObject.object;
            var elem = dataObject.elem;
            scope.currentRender(elem, object, this.setRule);
            baseObject.runRules();
        },

        getData : function(html) {

            // 通过递归获得到所有的对象
            var dataObject = baseObject.getDataObject(html, DataObject);

            // 通过继承对象来获得影子对象
            var dataRule = $.extend(dataObject);

            var dataObjectElemt = baseObject.getDataObject(html, ElemtObject);
            // 获得所有的属性
            var protoList = $(html).find("[data-proto]");
            for (var i = 0; i < protoList.length; i++) {

                // 获得到父对象的名称
                var parentObjectN = $(protoList[i]).closest("[data-object]").attr("data-object");

                // 获得属性的名称
                var protoN = $(protoList[i]).attr("data-proto");

                // 通过查找上级第一个对象标签来获得父元素
                var parentElemt = dataObjectElemt[parentObjectN];

                var parent = dataObject[parentObjectN];

                // 如果父元素存在，就把对应的属性放在父对象里
                if (parentElemt) {
                    parentElemt[protoN] = new ElemtObject($(protoList[i]));

                    // 给父对象添加属性
                    parent[protoN] = null;

                    // 如果该属性标签是值属性标签，那么给该属性赋值
                    if ($(protoList[i]).attr("data-value") !==  undefined) {

                        // 定义属性值
                        var val,

                        // 定义赋值方法
                        setVal;

                        // 根据设置来判断值是哪里的
                        // 目前支持三种值获取方式
                        // 第一 checked
                        // 第二 text
                        // 第三 value
                        switch($(protoList[i]).attr("data-value"))
                        {
                            case 'checked':
                                val = $(protoList[i]).prop("checked");
                                setVal = function(val, elem) {
                                    elem.prop("checked", val);
                                };
                                break;
                            case 'text':
                                val = $(protoList[i]).text();
                                setVal = function(val, elem) {
                                    elem.text(val);
                                };
                                break;
                            case 'value':
                                val = $(protoList[i]).val();
                                setVal = function(val, elem) {
                                    elem.val(val);
                                };
                                break;
                            case 'img':
                                val = {
                                    src: $(protoList[i]).attr("src"),
                                    alt: $(protoList[i]).attr("alt")
                                };
                                setVal = function(val, elem) {
                                    elem.attr("src", val.src);
                                    elem.attr("alt", val.alt);
                                };
                                break;
                            case 'file':
                                setVal = function(val, elem) {

                                    var files = elem.prop('files');
                                    if (files && files.length > 0) {
                                        var reader = new FileReader();
                                        reader.readAsDataURL(files[0]);
                                        reader.onload = function(evt){
                                            var fileString = evt.target.result;
                                            val = fileString;
                                            parent["__" + protoN + "__"] = val;
                                        }
                                    } else {
                                        val = null;
                                    }
                                };
                                break;
                            default: // todo 待完善
                                break;
                        }

                    };


                    // 给标签属性添加模版事件
                    var modeN = $(protoList[i]).attr("data-mode");
                    var isInit = $(protoList[i]).attr("data-init");
                    if (modeN) {
                        // 标签对象继承模版对象方法
                        var methods = components.getInstance(modeN).methods;
                        if (methods) {
                            for (var k in methods) {
                                parentElemt[protoN][k] = methods[k].bind({elem: parentElemt[protoN], object: val});
                                // parentElemt[protoN][k] = methods[k];
                            };
                        };

                        var modeCallBack = components.init(modeN);
                        if (modeCallBack) {
                            modeCallBack.prototype.elem = parentElemt[protoN];
                            modeCallBack.prototype.object = val;
                            modeCallBack.prototype.setRule = this.setRule;
                            modeCallBack.prototype.globleObject = dataObject;
                            modeCallBack.prototype.globleElemt = dataObjectElemt;

                            if (!isInit) {
                                new modeCallBack();
                            };
                        };

                       parentElemt[protoN].elem.attr("data-init", "true");

                    }


                    parent["__" + protoN + "__"] = val;

                    // 数据双向绑定监听
                    // 属性数据绑定到标签
                    baseObject.watchProperty(parent, protoN, $(protoList[i]), setVal);

                    // 值标签监听值绑定到属性
                    baseObject.watchElement(parent, protoN, parentElemt[protoN]);
                }

            }

            // 把所有父对象对应的模版继承过来
            for (var key in dataObjectElemt) {

                // 判断改对象是否有模版对象，有就把模板事件继承过来
                if (dataObjectElemt[key] instanceof ElemtObject) {

                    // 模版对象初始化
                    var modeN = dataObjectElemt[key].elem.attr("data-mode");

                    var isInit = dataObjectElemt[key].elem.attr("data-init");
                    if (modeN) {

                        // 标签对象继承模版对象方法
                        var methods = components.getInstance(modeN).methods;
                        if (methods) {
                            for (var k in methods) {
                                dataObjectElemt[key][k] = methods[k].bind({elem: dataObjectElemt[key], object: dataObject[key]});
                                // dataObjectElemt[key][k] = methods[k];
                            };
                        };

                        var modeCallBack = components.init(modeN);
                        if (modeCallBack) {
                            modeCallBack.prototype.elem = dataObjectElemt[key];
                            modeCallBack.prototype.object = dataObject[key];
                            modeCallBack.prototype.setRule = this.setRule;
                            modeCallBack.prototype.globleObject = dataObject;
                            modeCallBack.prototype.globleElemt = dataObjectElemt;

                            if (!isInit) {
                                new modeCallBack();
                            };
                        };

                        dataObjectElemt[key].elem.attr("data-init", "true");
                    };
                };
            };
            return {object: dataObject, elem: dataObjectElemt};
        },
        setRule : function(parent, protoN, callBack) {
            parent["__" + protoN + "__callBack"] = callBack;
            ruleList[ruleList.length] = function(){
                parent[protoN] = '';
            };
        }
    };
});