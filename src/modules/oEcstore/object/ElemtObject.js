define('ElemtObject', [], function(require, exports, module) {

    // 标签对象
    function ElemtObject(elem){

        // 属性标签
        this.elem = elem;

        // 添加属性标签的动作
        this.on = function(click, callBack){
            // 如果是change事件还是可以添加的
            this.elem.unbind(click);
            return this.elem.on(click, callBack);
        };

        // 获取标签的名字
        this.getName = function(){
            var objectName = this.elem.attr("data-object");
            var arrayName = this.elem.attr("data-array");
            var protoName = this.elem.attr("data-proto");
            return objectName ? objectName : arrayName ? arrayName: protoName ? protoName: '';
        };

        this.attr = function(name, value) {
            return this.elem.attr(name, value);
        };

        this.data = function(name) {
            return this.elem.data(name);
        };

        this.hide = function() {
            return this.elem.hide();
        };

        this.show = function() {
            return this.elem.show();
        };

        this.addClass = function(cls) {
            return this.elem.addClass(cls);
        };

        this.removeClass = function(cls) {
            return this.elem.removeClass(cls);
        };

        this.hasClass = function(cls) {
            return this.elem.hasClass(cls);
        };

        this.toggleClass = function(cls) {
            return this.elem.toggleClass(cls);
        };

        this.find = function(name) {
            return this.elem.find(name);
        };

        // 删除方法
        this.remove = function() {
            return this.elem.remove();
        };

        this.html = function(html) {
            return this.elem.html(html);
        }

        // 如果是数组标签
        if (elem.attr("data-array")) {
            // 第一，可以有模型对象
            this.modle = function() {

            }
        };
    }

    return ElemtObject;
});