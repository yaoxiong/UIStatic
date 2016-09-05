define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(id,hash) {
            if(id === 'res'){
                domObject.doit('/paycenter/deposit/res',hash, function(elem, object, setRule){
                    console.log('res');
                });
            }else{
                domObject.doit('/member/deposit', function(elem, object, setRule) {
                    var form = elem.formValidate.elem;
                    var $btnSubmit = elem.formSubmit.elem;
                    var paymentItem = elem.paymentList.elem.find('.payment-type-item');
                    if(elem.paymentList){
                        paymentItem.on('click',function(){
                            var $this = $(this);
                            $this.find('input[type="radio"]')[0].checked = true;
                        });
                        paymentItem.first().trigger('click');
                    }
                    return_url = form.find('input[name="payment[return_url]"]');
                    return_url.val(location.pathname + "#/member/deposit/res");
                    form.on('submit',function(e){
                        var value = $.trim(elem.depositInput.depositNum.elem.val());
                        if(isNaN(Number(value))){
                            elem.popup.show('请输入数字',1000);
                            e.preventDefault();
                            return;
                        }
                        var $this = $(this);
                        if($this.hasClass('disabled')){
                            e.preventDefault();
                            return;
                        } 
                    });
                    elem.formSubmit.on('click',function(){
                        var value = $.trim(elem.depositInput.depositNum.elem.val());
                        if(isNaN(Number(value))){
                            elem.popup.show('请输入数字',1000);
                            return;
                        }
                        var $this = $(this);
                        if($this.hasClass('disabled')) return;
                        // elem.formValidate.formSubmit(form,function(re){
                        //     if(re.error){
                        //         elem.popup.show(re.error,1000);
                        //     }
                        // });
                    });
                });
            }
        }
    };
});