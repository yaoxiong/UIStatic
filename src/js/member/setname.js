define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function() {
            domObject.doit('/member/settings/setname', function(elem, object, setRule) {
                var form = elem.formValidate.elem;
                // 表单提交
                elem.formSubmit.on("click",function(e){
                    var $this = $(this);
                    if($this.hasClass("disabled")) return;
                    elem.formValidate.formSubmit(form, function(data){
                        if(data.success){
                            elem.popup.show(data.success,1000,function(){
                                location.hash = "#/member";
                            });
                        }
                    });
                });
            });
        }
    };
});