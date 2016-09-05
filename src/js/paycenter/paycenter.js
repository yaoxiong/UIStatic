define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');


    module.exports = {
        init: function(id,action) {
            var glob = this;
            switch (action){
                case 'result' :
                    domObject.doit('/paycenter/result', id, function(elem, object, setRule) {
                        console.log("result",id);
                    });
                    break;
                case 'result_pay' :
                    domObject.doit('/paycenter/result_pay', id, function(elem, object, setRule) {
                        console.log("result_pay",id);
                    });
                    break;
                default:
                    domObject.doit('/paycenter', id, function(elem, object, setRule) {
                        var paycenter = {
                            order_id:null,
                            payment:null,
                            // 密码框
                            iptsPass:null,
                            focus:0,
                            inputs:{},
                            hybird_payment:null,
                            init:function(){
                                this.variableInit();
                                this.eventBinding();
                                this.getPaymentsSelect();
                            },
                            variableInit:function(){
                                var that = this;
                                var arr;
                                if(id.indexOf('-') > -1){
                                    arr = id.split('-');
                                    this.order_id = arr[0];
                                }else{
                                    this.order_id = id;
                                }
                                $('input').each(function(index,item){
                                    var $item = $(item);
                                    var name = $item.attr('name');
                                    if(name){
                                        that.inputs[name] = item;
                                    }
                                });
                                if(elem.dialog){
                                   this.iptsPass = elem.dialog.ipts_pass.elem.find("input[type=password]");
                                }
                            },
                            eventBinding:function(){
                                var that = this;
                                if(elem.payments){
                                    elem.payments.elem.find('.payment-type-header').on('click',function(){
                                        var $this = $(this);
                                        elem.payments.elem.toggleClass('close');
                                    });
                                    elem.payments.elem.on('click',function(e){
                                        var $target = $(e.target);
                                        if(e.target.tagName === "INPUT"){
                                            e.target.checked = !e.target.checked;
                                        }
                                        var $item = $target.closest('.payment-type-item');
                                        if($item.length){
                                            var input = $item.find('input[type=radio]');
                                            if(!input[0].checked){
                                                input[0].checked = true;
                                                that.payment = JSON.parse(input[0].value);
                                                that.checkPayment();
                                            }
                                        }
                                    });
                                }
                                if(elem.paycenter.btnSubmit){
                                    elem.paycenter.btnSubmit.on("click",function(e){
                                        var $this = $(this);
                                        if($this.hasClass('disabled')) return;
                                        that.doPayment();
                                    });
                                }
                                if(elem.hybirdPayments){
                                    elem.hybirdPayments.elem.find('.payment-type-header').on('click',function(){
                                        elem.hybirdPayments.elem.toggleClass('close');
                                    });
                                    elem.hybirdPayments.elem.on('click',function(e){
                                        var $target = $(e.target);
                                        if(e.target.tagName === "INPUT"){
                                            e.target.checked = !e.target.checked;
                                        }
                                        var $item = $target.closest('.payment-type-item');
                                        if($item.length){
                                            var input = $item.find('input[type=radio]')[0];
                                            if(!input.checked){
                                                input.checked = true;
                                                that.inputs["payment[combination_pay]"].value="true";
                                                that.hybird_payment = input.value;
                                                that.checkHybirdPayment();
                                            }
                                        }
                                    });
                                }
                                if(elem.dialog){
                                    elem.dialog.ipts_passResult.elem.on('input',function(){
                                        var pwd = $(this).val().trim();
                                        var len = pwd.length;
                                        for (var i = 0; i < len; i++) {
                                            that.iptsPass.eq("" + i + "").val(pwd[i]);
                                        }
                                        that.iptsPass.each(function(index,item) {   
                                            if (index >= len) {  
                                                $(this).val("");
                                            }  
                                        });  
                                        if (len == 6) {
                                            that.checkPass(function(){
                                                elem.dialog.close(function(){
                                                    that.submit();
                                                });
                                            });
                                        }  
                                    });
                                }
                                
                            },
                            getPaymentsSelect:function(){
                                toolObject.ajaxWrap({
                                    url:globleURL.payments_select,
                                    data:{
                                        'shipping[shipping_id]':this.inputs['shipping[shipping_id]'].value||"",
                                        'payment[def_pay][pay_app_id]':this.inputs['payment[def_pay][pay_app_id]'].value||"",
                                        'no_offline':this.inputs['no_offline'].value||"",
                                    },
                                    type:"POST"
                                },function(re){
                                    re = JSON.parse(re);
                                    if(re.success){
                                        elem.payments.paymentsList.html(re.data[0].html);
                                    }
                                });
                            },
                            checkPayment:function(){
                                var that = this;
                                toolObject.ajaxWrap({
                                    url:globleURL.payments_confirm,
                                    data:{
                                        'payment[pay_app_id]':JSON.stringify(this.payment),
                                        'order_id':this.order_id,
                                        'payment[currency]:':""
                                    },
                                    type:"POST"
                                },function(re){
                                    re = JSON.parse(re);
                                    if(re.error){
                                        elem.popup.show(re.error,1000);
                                        return;
                                    }
                                    if(re.success){
                                        if(id.indexOf('-') > -1){
                                            location.hash = "#/paycenter/"+that.order_id;
                                        }else{
                                            glob.init(that.order_id);
                                        }
                                    }
                                });
                            },
                            checkHybirdPayment:function(){
                                var that = this;
                                var pass = that.inputs["pay[password]"] ? that.inputs["pay[password]"].value : "";
                                toolObject.ajaxWrap({
                                    url:globleURL.payments_payment_money,
                                    data:{
                                        "payment[order_id]": that.inputs["payment[order_id]"].value||"",
                                        "payment[def_pay][cur_money]": that.inputs["payment[def_pay][cur_money]"].value||"",
                                        "payment[def_pay][pay_app_id]": that.inputs["payment[def_pay][pay_app_id]"].value||"",
                                        "payment[memo]": that.inputs["payment[memo]"].value||"",
                                        "pay[password]": pass,
                                        "payment[combination_pay]": that.inputs["payment[combination_pay]"].value||"",
                                        "payment[other_online][cur_money]": that.inputs["payment[other_online][cur_money]"].value||"",
                                        "payment[other_online][pay_app_id]": that.inputs["payment[other_online][pay_app_id]"].value||""
                                    },
                                    type:"POST"
                                },function(re){
                                    re = JSON.parse(re);
                                    object.paymentsList.cur_price = re.cur_money;
                                    elem.paycenter.btnSubmit.elem.removeClass('disabled');
                                });
                            },
                            checkPass:function(callback){
                                var that = this;
                                var pass = this.inputs['dialog_password'].value||"";
                                toolObject.ajaxWrap({
                                    url:globleURL.payments_password,
                                    data:{
                                        "pay_password":pass
                                    },
                                    type:"POST"
                                },function(re){
                                    re = JSON.parse(re);
                                    if(re.error){
                                        elem.dialog.elem.find('.dialog').addClass('error');
                                        elem.dialog.elem.find('.dialog-password-title').text('密码输入错误');
                                        if(re.data[0].error_num == 4){
                                            elem.popup.show(re.error,1000);
                                        }
                                        return;
                                    }
                                    if(re.success){
                                        that.inputs["pay[password]"].value = pass;
                                        if(typeof callback === 'function')
                                            callback();
                                        elem.dialog.elem.find('.dialog').removeClass('error');
                                        elem.dialog.elem.find('.dialog-password-title').text('请输入支付密码');
                                    }
                                });
                            },
                            doPayment:function(){
                                var that = this;
                                if(this.inputs['payment[def_pay][pay_app_id]'].value === 'deposit'){
                                    if(elem.hybirdPayments){
                                        if(!this.hybird_payment){
                                            elem.popup.show('请选择剩余支付方式或更换支付方式',1000);
                                            return;
                                        }
                                    }
                                    if(elem.dialog)
                                        elem.dialog.open();
                                }else{
                                    this.submit();
                                }
                            },
                            submit:function(){
                                elem.paycenterStatus.elem.find('.payments-status').removeClass("done").addClass('been');
                                object.paycenterStatus.title = "等待支付中";
                                elem.paycenter.btnSubmit.addClass('disabled');
                                // setTimeout(function(){
                                //     $(window).on('beforeunload',function(){
                                //         return '';
                                //     });
                                // },3000);
                                elem.paycenter.form.elem.submit();
                            }
                        };
                        paycenter.init();
                    });
            }
            
        }
    };
});