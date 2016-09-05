define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var components = require('components');

    var dom_elem, dom_object, dom_setRule;

    var lost_key, lost_account;

    // 提示信息
    function showTips(msg){
        var passport_feedback = dom_elem.feedback.elem || $('.passport-feedback');
        passport_feedback.addClass("show").text(msg);
        setTimeout(function(){
            passport_feedback.removeClass("show");
        }, 3000);
    }
    // 全局对象初始化
    function passportInit(elem,object,setRule,objectRoot){
        dom_elem = elem;
        dom_object = object;
        dom_setRule = setRule;
    }

    module.exports = {
        init: function(action,hash) {
            switch (action){
                case 'login' :
                    domObject.doit('/passport', function(elem, object, setRule) {
                        // 初始化
                        passportInit(elem,object,setRule);
                        // 表单自动验证绑定
                        var form = elem.formValidate.elem;
                        // formAutoValidate(form);
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    scope.isLogin = true;
                                    elem.popup.show(data.success,1000,function(){
                                        scope.backHome = -3;
                                        history.back();
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'register' :
                    domObject.doit('/passport/register', function(elem, object, setRule) {
                        passportInit(elem,object,setRule,object.passportRegister);
                        // 当前注册方式
                        var currentForm,$currentForm;
                        var license = $('.license-ipt');
                        currentForm = elem.tab_title.elem.children().first().attr('data-tab');
                        $currentForm = elem.tab_content.elem.children().first();

                        // tab切换
                        elem.tab_title.elem.find(".btn").on("click",function(e){
                            var $this = $(this);
                            var label = $this.attr('data-tab');
                            currentForm = label;
                            $this.addClass("on").siblings().removeClass("on");
                            var element = elem.tab_content.elem.find("[data-tab="+label+"]");
                            $currentForm = $(element);
                            $currentForm.removeClass("hide").siblings().addClass("hide");
                            elem.formValidate.formValidateHandle();
                        });
                        // 表单自动验证绑定
                        var form = elem.formValidate.elem;
                        // formAutoValidate(form);
                        // 表单提交
                        elem.formSubmit.on('click',function(){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;

                            var iptPassword = $currentForm.find('.ipt-password').val();
                            var iptPasswordConfirm = $currentForm.find('.ipt-password-confirm').val();
                            if(iptPassword !== iptPasswordConfirm){
                                elem.formValidate.showTips('两次密码不匹配');
                                return;
                            }
                            var str = license[0].checked ? "&license="+ encodeURIComponent(license.val()) : "";
                            elem.formValidate.formSubmit($currentForm.find('form'),str,function(data){
                                if(data.success){
                                    elem.popup.show(data.success,1000,function(){
                                        location.hash = "#/member";
                                    });
                                }
                            });
                        });

                    });
                    break;
                case 'lost' :
                    domObject.doit('/passport/lost',function(elem, object, setRule) {
                        passportInit(elem,object,setRule,object.passportLost);

                        var form = elem.formValidate.elem;
                        var $emailIpt = form.find('.ipt-email-verifycode');
                        var $mobileIpt = form.find('.ipt-mobile-verifycode');
                        form.find('.ipt-usrname').on('change',function(e){
                            var $this = $(this);
                            var isEmail = elem.formValidate.isEmail($this.val());
                            if(isEmail){
                                $emailIpt.closest('.form-group').removeClass('hide');
                                $mobileIpt.closest('.form-group').addClass('hide');
                            }else{
                                $emailIpt.closest('.form-group').addClass('hide');
                                $mobileIpt.closest('.form-group').removeClass('hide');
                            }
                        });
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form,function(data){
                                if(data.success){
                                    data = data.data[0];
                                    lost_key = data.key;
                                    lost_account = data.account;
                                    if(hash && hash.is_alter_pwd){
                                        location.hash= "#/passport/modifypass2";
                                    }else{
                                        location.hash = "#/passport/lost2";
                                    }

                                }
                            });
                        });
                    });
                    break;
                case 'lost2' :
                    domObject.doit('/passport/lost2',function(elem, object, setRule) {
                        passportInit(elem,object,setRule,object.passportLost2);
                        
                        var form = elem.formValidate.elem;
                        // 设置上个lost传过来的key,account
                        form.find('.ipt-key').val(lost_key || "");
                        form.find('.ipt-account').val(lost_account || "");
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            var iptPassword = form.find('.ipt-password').val();
                            var iptPasswordConfirm = form.find('.ipt-password-confirm').val();
                            if(iptPassword !== iptPasswordConfirm){
                                elem.formValidate.showTips('两次密码不匹配');
                                return;
                            }
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    elem.popup.show(data.success,1000,function(){
                                        data = data.data[0];
                                        location.hash = "#/" + data.redirect;
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'license':
                    domObject.doit('/passport/license',function(elem, object, setRule) {
                        
                    });
                    break;
            }

        }
    };
});