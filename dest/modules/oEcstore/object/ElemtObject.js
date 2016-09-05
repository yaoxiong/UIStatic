define('ElemtObject', [], function(require, exports, module) {

    // 标签对象
    function ElemtObject(elem){

        // 属性标签
        this.elem = elem;

        // 添加属性标签的动作
        this.on = function(click, callBack){
            this.elem.on(click, callBack);
        };

        // 获取标签的名字
        this.getName = function(){
            var objectName = this.elem.attr("data-object");
            var arrayName = this.elem.attr("data-array");
            var protoName = this.elem.attr("data-proto");
            return objectName ? objectName : arrayName ? arrayName: protoName ? protoName: '';
        };

        // 删除方法
        this.remove = function() {
            this.elem.remove();
        };

        // 如果是数组标签
        if (elem.attr("data-array")) {
            // 第一，可以有模型对象
            this.modle = function() {

            }
        };
    }

    return ElemtObject;
});