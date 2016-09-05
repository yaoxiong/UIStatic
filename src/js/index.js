// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    var $ = require('jquery');
    window.$ = $;
    require("cookie");

    var region_data = require('regionData');
    var Router = require('Router');
    var scope = require('scope');
    var toolObject = require("toolObject");
    var template = require('template');

    // 添加模版对象1111
    var passport = require("passport");
    var coupon = require("coupon");
    var credit = require("credit");
    var product = require('product');
    var cart = require('cart');
    var checkout = require('checkout');
    var home = require('home');
    var member = require('member');
    var search = require('search');
    var logistic = require('logistic');
    var ticket = require('ticket');

    var memberBalance = require('balance');
    var memberDeposit = require('deposit');
    var memberSignIn = require('signin');
    var memberDisucss = require('disucss');

    // 门店地址
    var shoppingAddress = require('shoppingAddress');
    var shoppingAddAddress = require('shoppingAddaddress');
    var shoppingEditAddress = require('shoppingEditAddress');


    var memberSettings = require('settings');
    var gallery = require('gallery');
    var galleryCategory = require('galleryCategory');
    var balance = require('balance');
    // 门店
    var branch = require('branch');
    var branchDetail = require('branchDetail');
    var branchMore = require('branchMore');
    var branchMap = require('branchMap');

    var citySelect = require('citySelect');
    var afterSale = require('afterSale');
    var memberCard = require('memberCard');
    var favorite = require('favorite');
    var footprint = require('footprint');
    var commentGood = require('commentGood');
    var orders = require('orders');
    var ordersDetail = require('ordersDetail');
    var orderCancel = require('canceOrder');
    var paycenter = require('paycenter');
    var paystatus = require('paystatus');

    // 自定义页面
    var custompage = require('custompage');

    // // 添加模版对象
    var components = require('components');

    var domObject = require('domObject');


    // 购物车商品模版
    components.register('goodsI',function(){
        return {
            init:function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                function updataCart() {
                    toolObject.ajaxWrap({
                        url: globleURL.cartUpdate,
                        type: "post",
                        data:  toolObject.getDeletParameters(object)
                    }, function(data) {
                        data = JSON.parse(data);
                        if (data.success) {
                            // globleElemt.popup.show(data.success);
                            if (data.is_empty) {
                                globleObject.cart.salePrice = "¥0.00";
                                globleObject.cart.totalPrice = "¥0.00";
                                globleElemt.cart.itemClearing.addClass("disabled");
                            } else {
                                if (data.can_checkout == 1) {
                                    globleElemt.cart.itemClearing.removeClass("disabled");
                                }else {
                                    globleElemt.cart.itemClearing.addClass("disabled");
                                };
                                if (object.good_type === "goods") {
                                    object.totalprice = data.edit_ajax_data.buy_price;
                                } else if (object.good_type === "adjunct") {
                                    object.totalprice = data.edit_ajax_data.buy_price;
                                }
                                var giftList = " ";
                                if (data.order_gift && data.order_gift.length > 0) {
                                    for (var i = 0; i < data.order_gift.length; i++) {
                                        var gift = data.order_gift[i];
                                        giftList += toolObject.newGoodItem(gift, i);
                                    };
                                };
                                if (giftList.trim()) {
                                    $('.cart-exchange-list[data-array="ordergiftsItem"]').show();
                                } else {
                                    $('.cart-exchange-list[data-array="ordergiftsItem"]').hide();
                                }
                                globleObject.cart.salePrice = data.sub_total.discount_amount_order;
                                globleObject.cart.totalPrice = data.sub_total.promotion_subtotal;
                                domObject.html($(".order-gift-list"), giftList);
                            }
                        } else {
                            globleElemt.popup.show(data.error_msg);
                        }

                    }, function(err) {
                        globleElemt.popup.show(err);
                    });
                }

                if (typeof elem.plus !== "undefined") {
                    elem.plus.on('click', function(e) {
                        elem.cut.removeClass("disabled");
                        elem.plus.removeClass("disabled");
                        object.goodNum = parseInt(object.goodNum) + 1;
                        if (object.goodNum > parseInt(object.maxNum)) {
                            object.goodNum = parseInt(object.maxNum);
                            // globleElemt.popup.show("max:" + parseInt(object.maxNum));
                            elem.cut.removeClass("disabled");
                            elem.plus.addClass("disabled");
                        } else if(object.goodNum > parseInt(object.stockNum)) {
                            object.goodNum = parseInt(object.stockNum);
                            elem.cut.removeClass("disabled");
                            elem.plus.addClass("disabled");
                            // globleElemt.popup.show("stock:" + parseInt(object.stockNum));
                        } else {
                            updataCart(object);
                        }
                    });
                };

                if (typeof elem.cut !== "undefined") {
                    elem.cut.on('click', function(e) {
                        elem.cut.removeClass("disabled");
                        elem.plus.removeClass("disabled");
                        object.goodNum -= 1;
                        if (object.goodNum < parseInt(object.minNum)) {
                            object.goodNum = parseInt(object.minNum);
                            elem.cut.addClass("disabled");
                            elem.plus.removeClass("disabled");
                            // globleElemt.popup.show("min:" + parseInt(object.minNum));
                        } else {
                            updataCart(object);
                        }
                    });
                };

                if (typeof elem.goodNum !== "undefined") {
                    elem.goodNum.elem.on("change", function(e) {
                        elem.cut.removeClass("disabled");
                        elem.plus.removeClass("disabled");
                        if (object.goodNum < parseInt(object.minNum)) {
                            object.goodNum = parseInt(object.minNum);
                            elem.cut.addClass("disabled");
                            elem.plus.removeClass("disabled");
                            // globleElemt.popup.show("min:" + parseInt(object.minNum));

                        } else if (object.goodNum > parseInt(object.maxNum)) {
                            object.goodNum = parseInt(object.maxNum);
                            elem.cut.removeClass("disabled");
                            elem.plus.addClass("disabled");
                            // globleElemt.popup.show("max:" + parseInt(object.maxNum));
                        } else if(object.goodNum > parseInt(object.stockNum)) {
                            object.goodNum = parseInt(object.stockNum);
                            elem.cut.removeClass("disabled");
                            elem.plus.addClass("disabled");
                            // globleElemt.popup.show("stock:" + parseInt(object.stockNum));
                        }
                        updataCart(object);
                    });
                };

                if (typeof elem.checkVal !== "undefined") {
                    elem.checkVal.elem.on("change", function(e) {
                        updataCart(object);
                    });
                };

                // setRule(object, "totalprice", function() {
                //     var totalP = parseFloat(object.price) * parseInt(object.goodNum);
                //     totalP = "￥" + totalP.toFixed(2);
                //     return totalP;
                // });

                setRule(object, "giftPrice", function() {
                    return parseInt(object.gift) * parseInt(object.goodNum);
                });
            }
        };
    });

    // 数量选择
    components.register('countSelect',function(){
        var max,min;
        var dom_elem;
        var dom_object;
        function setCount(val){
            val = val || 1;
            val = val >= max ? max : val;
            val = val <= min ? min : val;
            dom_object.countNum = val;
        }
        return {
            init:function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                var $plus,$minus,$countInput;
                max = 99999;
                min = 0;
                $plus = elem.countPlus;
                $minus = elem.countMinus;
                $countInput = elem.countNum;
                object.countNum = 1;
                dom_elem = elem;
                dom_object = object;
                var smax = parseInt(elem.elem.attr('attr-max'));
                max = isNaN(smax) ? max : smax;
                $countInput.on("change",function(){
                    setCount(this.value);
                });
                $plus.on("click",function(){
                    var smax = parseInt(elem.elem.attr('attr-max'));
                    max = isNaN(smax) ? max : smax;
                    setCount(object.countNum >= max ? max : object.countNum + 1);
                });
                // 可动态修改最小值
                $minus.on('click',function(){
                    var smin = parseInt(elem.elem.attr('attr-min'));
                    min = isNaN(smin) ? min : smin;
                    setCount(object.countNum <= min ? min : object.countNum - 1);
                });
            },
            methods:{
                setMax: function(num){
                    if(isNaN(num)) return;
                    max = Number(num);
                    dom_elem.elem.attr('attr-max',max);
                },
                setMin: function(num){
                    if(isNaN(num) || num < 0) return;
                    min = Number(num);
                    dom_elem.elem.attr('attr-min',min);
                },
                setCount: setCount
            }
        };
    });
    // 表单非空验证
    components.register("formValidate",function(){
        var $wrapper;
        var formGroups;
        var feedback;
        var timer;
        var $btnSubmit;
        var iptsArray;
        var isSerialize = true;
        var isAutoValidate = true;
        /* 系统验证码 */
        function changeCode(img, url){
            url = url || img.src.split('?')[0];
            var random = +new Date();
            img.src = url + '?' + random;
            return false;
        }
        function vcodeInit($ele){
            $.each($ele,function(){
                var url;
                var img;
                var el = this;
                if(el.tagName === 'IMG') {
                    img = el;
                    url = el.getAttribute('src').split('?')[0];
                }
                else if(el.tagName === 'A') {
                    img = el.previousElementSibling;
                    url = el.getAttribute('href');
                }
                $(el).on("click",function(){
                    changeCode(img, url);
                });
            });
        }
        /* 手机验证码 邮箱验证码 */
        function normalVcodeInit($ele){
            $ele.on("click",function (e) {
                e.preventDefault();
                var str = '';
                var $this = $(this);
                var $parent = $this.closest('.form-group-wrapper');
                var $usrPhone = $parent.find(".ipt-usrname");
                var $verifyIpt = $parent.find(".ipt-verifycode:visible");
                if($this.hasClass('disabled')) return false;

                if($verifyIpt.length && $.trim($verifyIpt.val()) === ''){
                    showTips('请输入验证码');
                    return;
                }
                if($verifyIpt.length){
                    str = '&sms_vcode=' + $verifyIpt.val();
                }
                sendVerify(this, 'uname=' + $usrPhone.val() + '&type='+ $ele.attr('data-type') + str);
            });

            function sendVerify(el, data) {
                $el = $(el);
                var url = $el.attr('data-src');
                $el.addClass('disabled');
                toolObject.ajaxWrap({
                    url:url,
                    data:data
                },function(rs){
                    if(!rs) return;
                    try{
                        rs = $.parseJSON(rs);
                    } catch (e) {}
                    if(rs.error) {
                        $el.removeClass('disabled').html('重发验证码');
                        clearInterval(timer);
                        if(typeof rs.error === 'string') showTips(rs.error);
                    }else{
                        timer = toolObject.countdown(el, {
                            start: 120,
                            secondOnly: true,
                            callback: function(e) {
                                $el.removeClass('disabled').html('重发验证码');
                            }
                        });
                    }
                });
            }
        }
        // 事件绑定，右侧的删除按钮，密码显示隐藏
        function eventInit(){
            formGroups.each(function(index,item){
                var that = $(item);
                that.find(".input-group-control").on("keyup",function(e){
                    var $close = that.find('.iconfont-close');
                    if(!this.value){
                        $close.addClass('hide');
                    }else{
                        $close.removeClass('hide');
                    }
                });
                that.find(".iconfont-close").on("click",function(e){
                    var $input = that.find('.input-group-control');
                    $input.val("");
                    $input.trigger("change");
                    $(this).addClass('hide');
                });
                that.find(".iconfont-eye").on("click",function(e){
                    var $this = $(this);
                    var $input = that.find('.input-group-control');
                    if($this.hasClass("iconfont-eye-slash")){
                        $input.attr("type","password");
                        $this.removeClass("iconfont-eye-slash");
                    }else{
                        $input.attr("type","text");
                        $this.addClass("iconfont-eye-slash");
                    }
                });
            });
        }
        function showTips(msg){
            if(!msg) return;
            if(feedback.length){
                feedback.text(msg).addClass("show");
                setTimeout(function(){
                    feedback.removeClass("show");
                }, 3000);
            }else{
                return;
            }
        }
        // 表单验证，在input标签中增加 data-required 属性作为非空标识，
        // data-filter 属性为验证标识，有phone,email,illegal 3种
        // 回调函数，第一个字段是表单是否完成，第二个字段是需重新填写的元素
        function validate(callback){
            var isComplete = true;
            var inputs = $wrapper.find("input:visible,textarea");
            var element;
            $.each(inputs,function(index,item){
                var $this = $(this);
                var filter_str;
                if($this.attr('data-required') !== "true") return;
                filter_str = $this.attr('data-filter');
                var type = $this.attr('type');
                var value;
                if(type == "checkbox" || type == "radio"){
                    value = $this[0].checked;
                }else{
                    value = $.trim($this.val());
                }
                if(!value){
                    isComplete = false;
                    element = $this;
                    return false;
                }
                if(filter_str){
                    if(!filter(filter_str,value)){
                        isComplete = false;
                        element = $this;
                        return false;
                    }
                }
            });
            if(callback){
                callback(isComplete,element);
            }
            return isComplete;
        }
        /**
         * 校验器
         * @param  {[string]} type 校验类型，目前有email, phone, illegal(--非法字符)
         * @param  {[string]} str  校验字符串
         * @return {[boolean / function]} 如果不传字符串，则返回具体类型的校验器，如果传入字符串，则返回校验结果
         */
        function filter(type,str){
            var filter_list = {
                'email' : /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i,
                'phone' : /^1[34578]{1}[0-9]{9}$/,
                'illegal' : /^[^\x00-\x2d^\x2f^\x3a-\x3f]+$/i
            };
            if(str !== undefined){
                if(filter_list[type])
                    return filter_list[type].test(str);
                return false;
            }
            return function(str){
                if(filter_list[type])
                    return filter_list[type].test(str);
                return false;
            };
        }
        /**
         * 表单提交
         * @param  {[type]} $form               表单dom，jQuery类型
         * @param  {[type]} hash         提交dom
         * @param  {[type]} callBack feedback父对象用于绑定feedback
         */
        function formSubmit($form, hash, callBack){
            if(typeof hash === 'function') {
                callBack = hash;
                hash = '';
            }
            data = isSerialize ? $form.serialize() + hash : hash;
            var url = $form.attr("action");
            toolObject.ajaxWrap({
                url:url,
                data:data,
                type:'POST'
            },function(re){
                try{
                    re = JSON.parse(re);
                    var data;
                    if(re.error){
                        showTips(re.error);
                        data = re.data[0];
                        if(data){
                            if(data.show_varycode && data.show_varycode == '1'){
                                $('.verify-code').closest('.form-group').removeClass('hide');
                            }
                            if(data.vcode_refresh && data.vcode_refresh == '1'){
                                $form.find('.verify-code').trigger('click');
                            }
                        }
                    }
                }catch(e){}
                if(typeof callBack === 'function') callBack(re);

            });
        }
        // 通用的表单验证
        function formValidateHandle(){
            validate(function(bool,ele){
                if(!bool){
                    $btnSubmit.addClass("disabled");
                }else{
                    $btnSubmit.removeClass("disabled");
                }
            });
        }
        // 表单自动验证绑定
        function formAutoValidate(ipts){
            formValidateHandle();
            ipts.on("keyup",formValidateHandle)
                .on("change",formValidateHandle);
        }
        // 输入框初始状态
        function formInputReset(ipts){
            ipts.each(function(index,item){
                var $item = $(item);
                var $close = $item.closest('.form-group').find('.iconfont-close');
                if(!$item.val()){
                    $close.addClass('hide');
                }else{
                    $close.removeClass('hide');
                }
            });
        }
        return {
            init: function(){

                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    global_object = this.globleObject,
                    global_elem = this.globleElemt;
                if(elem.getName() !== "formValidate") return;
                $wrapper = elem.elem;
                isSerialize = elem.elem.attr('data-serialize') == 'false' ? false : true;
                isAutoValidate = elem.elem.attr('data-validate') == 'false' ? false : true;
                feedback = $('.passport-feedback');
                formGroups = $wrapper.find(".form-group");
                var $vcode = $wrapper.find(".verify-code");
                var $normalvcode = $wrapper.find(".normal-verify-code");
                if(global_elem.formSubmit){
                    $btnSubmit = global_elem.formSubmit.elem;
                }else{
                    $btnSubmit = $wrapper.find("input[name|='submit'],.btn-submit").first();
                }
                iptsArray = $wrapper.find('input,textarea');
                // 事件绑定
                eventInit();
                // 系统验证码
                if($vcode.length) vcodeInit($vcode);
                // 手机，邮箱验证码
                if($normalvcode) normalVcodeInit($normalvcode);
                // 输入框reset
                formInputReset(iptsArray);
                // 自动验证
                if(isAutoValidate) formAutoValidate(iptsArray);
                // 刷新验证码
                $vcode.trigger('click');
            },
            methods:{
                validator: validate,
                changeCode: changeCode,
                formSubmit: formSubmit,
                formValidateHandle: formValidateHandle,
                showTips: showTips,
                isEmail : filter('email'),
                isPhone : filter('phone'),
                isIllegal: filter('illegal')
            }
        };
    });

    // 标题栏模块
    components.register('header', function() {

        return {
            init: function() {
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                // 按钮返回
                if(elem.backBtn) {
                    elem.backBtn.on('click', function(e) {
                        var backHome = scope["backHome"];
                        scope["backHome"] = -1;
                        scope["orderNum"] = 0;
                        history.go(backHome);
                    });
                }

                if (elem.titleSetting) {
                    elem.titleSetting.on('click', function(e) {
                        location.href = "#/member/settings";
                    });
                };

                if (elem.moreBtn) {
                    // $('body').on('click',function(e){
                    //     var target = $(e.target);
                    //     if(target.hasClass('title-more') || target.closest('.title-more').length){
                    //         elem.titleNav.elem.toggleClass('act');
                    //     }
                    // });
                    // 更多选择按钮
                    elem.moreBtn.on('click', function(e) {
                        elem.titleNav.elem.toggleClass('act');
                    });
                    // 更多选择对象
                    elem.home.on('click', function(e) {
                        location.href = '#/';
                    });
                    elem.classify.on('click', function(e) {
                        location.href = '#/gallery/category';
                    });
                    elem.cart.on('click', function(e) {
                        location.href = '#/cart';
                    });
                    elem.mymine.on('click', function(e) {
                        location.href = '#/member';
                    });
                };
            }
        }
    });

    // 消息提示
    components.register('Popup', function(){
        var flag = false;
        var popupElement;
        function show(msg,delay,callBack){
            if(!msg || flag === true) return;
            if(typeof delay === 'function'){
                callBack = delay;
                delay = 2000;
            }
            delay = delay || 2000;
            var popup = popupElement || $('.popup');
            if(popup && popup.length){
                popup.removeClass('hide').text(msg);
                flag = true;
                setTimeout(function(){
                    popup.addClass('hide');
                    if(typeof callBack === 'function') callBack();
                    flag = false;
                },delay);
            }else{
                alert(msg);
            }
        }
        window.popup = show;
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                // if(!elem.elem) return;
                flag = false;
                popupElement = elem.elem;
            },
            methods: {
                show: show
            }
        };
    });
    components.register('selectList',function(){
        return {
            init:function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.elem.on('click',function(e){
                    elem.elem.addClass('act');
                });
                $('body').on('click',function(e){
                    var target = $(e.target);
                    if(target.hasClass('select-list')||target.closest('.select-list').length){
                        elem.elem.addClass('act');
                    }else{
                        elem.elem.removeClass('act');
                    }
                });
            }
        };
    });
    // 二维码
    components.register('codeImg', function(){
        var barcode_code,barcode_img,qrcode_img;
        var scale = 1;
        var options = {
            barcodeHeight:68,
            barWidth:1,
            barbgColor:'transparent',
            qrcodeSize:163,
            splitStr:'-'
        };
        function formatCode(text) {
            var length = text.length;
            var gap = 4;
            var result = '';
            for(var i=0; i<length;i += gap){
                result += text.substr(i,gap) + options.splitStr;
            }
            result = result.substr(0,result.length-1);
            return result;
        }
        /**
         * 根据数据填充二维码，默认二维码数据与条形码数据是一样的
         * @param  {[type]} barcode 条形码数据
         * @param  {[type]} qrcode  二维码数据
         * @param  {[type]} opt     配置
         * 条形码：barcodeHeight, barWidth, barbgColor
         * 二维码：qrcodeSize
         * 格式化编码：splitStr
         */
        function drawCode(barcode,qrcode,opt){
            if(!barcode || !QRCode || !$.barcode ) return;
            if( Object.prototype.toString.call(qrcode).slice(8,-1) === "Object" ){
                opt = qrcode;
                qrcode = barcode;
            }
            if(!qrcode) qrcode = barcode;
            $.extend(options, opt||{});
            if(barcode_img){
                barcode_img.empty();
                barcode_img.barcode(barcode, "code128", {
                    showHRI:false,
                    barHeight:options.barcodeHeight*scale,
                    barWidth:options.barWidth * scale,
                    bgColor:options.barbgColor
                });
                if(barcode_code) barcode_code.text(formatCode(barcode));
            }
            if(qrcode_img){
                qrcode_img.empty();
                var qrc = new QRCode(qrcode_img[0], {
                    width : options.qrcodeSize * scale,//设置宽高
                    height : options.qrcodeSize * scale
                });
                qrc.makeCode(qrcode);
            }
        }
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                barcode_code = elem.codeImg_barcode ? elem.codeImg_barcode.elem : null;
                barcode_img = elem.codeImg_barcodeImg ? elem.codeImg_barcodeImg.elem : null;
                qrcode_img = elem.codeImg_qrcodeImg ? elem.codeImg_qrcodeImg.elem : null;
                scale = Number($('html').data('dpr')) || 1;
            },
            methods: {
               drawCode:drawCode
            }
        };
    });
    // 收藏
    components.register('favorite', function(){
        var globleElemt;
        // true收藏，false取消收藏
        function toggleFavorite(id,bool,callback){
            if(!id) return;
            var url = bool ? globleURL.addFavorite : globleURL.cancelFavorite;
            toolObject.ajaxWrap({
                url: url,
                data:{
                    gid:id,
                    type:'goods'
                },
                type:'POST'
            },function(re){
                re = JSON.parse(re);
                if(re.msgid == 40301){
                    if(globleElemt.popup){
                        globleElemt.popup.show(re.error,1000,function(){
                            location.hash = "#/passport";
                        });
                    }else{
                        alert(re.error);
                        location.hash = "#/passport";
                    }

                }
                if(typeof callback === 'function'){
                    callback(re);
                }
            });
        }
        function mutiRemoveFavorite(array,callback){
            if(!array) return;
            toolObject.ajaxWrap({
                url: globleURL.cancelFavoriteMuti,
                data:{
                    gid:array.join(','),
                    type:'goods'
                },
                type:'POST'
            },function(re){
                re = JSON.parse(re);
                if(typeof callback === 'function'){
                    callback(re);
                }
            });
        }
        return {
            init: function(){

                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject;
                globleElemt = this.globleElemt;
            },
            methods: {
                toggleFavorite:toggleFavorite,
                mutiRemoveFavorite:mutiRemoveFavorite
            }
        };
    });
    // 点赞
    components.register('putIn', function() {
        var suc = null;
        var fl = null;
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                var isClick = false;
                elem.on('click', function(e) {
                    if (!isClick) {
                        isClick = true;
                        if (!elem.hasClass("act")) {
                            toolObject.ajaxWrap({
                                url : globleURL.putIn,
                                type: 'post',
                                data: {
                                    'id' : elem.data("id"),
                                    'type': elem.data("type")
                                }
                            }, function(data){
                                elem.removeClass("act").removeClass("break").addClass("act");
                                if (typeof object.num != "undefined") {
                                    if (!object.num) {
                                        object.num = 0;
                                    };
                                    object.num = parseInt(object.num) + 1;
                                };
                                if (suc) {
                                    suc(data);
                                };
                                isClick = false;
                            }, function(err){
                                if (fl) {
                                    fl(err);
                                };
                                isClick = false;
                            });
                        } else {
                            toolObject.ajaxWrap({
                                url: globleURL.putOut,
                                type: 'post',
                                data: {
                                    'id' : elem.data("id"),
                                    'type': elem.data("type")
                                }
                            }, function(data) {
                                elem.removeClass("act").removeClass("break").addClass("break");
                                if (typeof object.num != "undefined") {
                                    object.num = parseInt(object.num) - 1;
                                };
                                if (suc) {
                                    suc(data);
                                };
                                isClick = false;
                            }, function(err) {
                                if (fl) {
                                    fl(err);
                                };
                                isClick = false;
                            })
                        }
                    };
                });
            },
            methods: {
                callBack: function(success, fail) {
                    suc = success;
                    fl = fail;
                }
            }
        };
    });
    // 加入购物车
    components.register('ptAddCart', function(){
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
            },
            methods: {
            }
        };
    });

    // 弹出框模块
    components.register('mask', function() {
        var callBack;
        return {
            init: function() {
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;

                callBack = function() {};

                elem.cancle.on('click', function(e) {
                    callBack(false);
                    elem.elem.hide();
                });
                elem.sure.on('click', function(e) {
                    callBack(true);
                    elem.elem.hide();
                });
            },
            methods: {
                show: function(callB, dialogMain) {
                    // 显示弹出框
                    this.elem.elem.removeClass('hide');
                    this.elem.elem.show();

                    // 判断有几个参数
                    var argLength = arguments.length;
                    // 如果没有参数，那就不用做什么
                    // 如果参数有一个，那就要判断是回调方法还是弹出框内容
                    if (argLength === 1) {
                        if(typeof(callB) === "string") {
                            dialogMain = callB;
                            callB = function() {};
                        }
                    } else if(argLength === 2) {
                        if(typeof(callB) === "string" && typeof(dialogMain) === "function") {
                            var cb = dialogMain;
                            dialogMain = callB;
                            callB = cb;
                        }else if (typeof(callB) === "function" && typeof(dialogMain) === "string") {

                        }else{
                            throw Error("method show's arguments(string, function)");
                        }
                    }
                    if (callB) {
                        callBack = callB;
                    };
                    if (dialogMain) {
                        this.object.dialogMain = dialogMain;
                    };
                },
                hide: function() {
                    this.elem.elem.hide();
                }
            }
        };
    });

    components.register('dialog', function(){
        var flag = false;
        var $elem_mask;
        var $elem_dialog;
        var $elem_close;
        function open(init){
            if(flag) return;
            flag = true;
            if(typeof init === 'function') init();
            $elem_mask.removeClass('hide');
            $elem_mask.on('touchmove',function(e){
                var $target = $(e.target);
                if($target.hasClass('mask')){
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            $('body').on('mousewheel',function(e){
                e.preventDefault();
                e.stopPropagation();
            });
            setTimeout(function(){
                $elem_dialog.addClass('on');
            },80);
        }
        function close(callback){
            flag = false;
            $elem_dialog.removeClass('on');
            $elem_mask.addClass('hide');
            $elem_mask.off('touchmove');
            $('body').off('mousewheel');
            if(typeof callback === 'function') callback();
        }
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                flag = false;
                $elem_mask = elem.elem;
                $elem_dialog = elem.elem.find('.dialog');
                $elem_close = elem.elem.find('.close');
                $elem_close.on('click',close);
            },
            methods:{
                open: open,
                close: close
            }
        };
    });
    // 选择器
    components.register('picker', function(){
        var flag = false;
        var $elem_mask;
        var $elem_dialog;
        var $picker;
        var $pickerSlots;
        var pickerScrolls = [];
        var pickerValue = [];
        var steps = 0,currentStep = 0;
        var fetchData,callBack;
        var initialData;
        var unitHeight;
        var config = {
            default:[]
        };
        // 选择器初始化，滚动事件绑定
        function pickerInit(){
            $pickerSlots = $picker.find('.picker-slot');
            $pickerSlots.each(function(index,item){
                var that = this;
                pickerScrolls[index] = new IScroll(that,{
                    mouseWheel: true,
                    tap: true
                });
            });
            unitHeight = $picker.find('.picker-item').height();
            steps = pickerScrolls.length;
            scrollReset();
            setDefault();
            // 绑定滚动事件
            $.each(pickerScrolls,function(index,pickerScrollItem){
                var that = pickerScrollItem;
                var height = unitHeight;
                pickerScrollItem.on('scrollEnd', function(){
                    var unit = Math.round(that.y / height);
                    if(Math.abs(unit - that.y / height) < 0.05){
                        var selected = $($(that.scroller).children()[Math.abs(unit)]);
                        selected.addClass('picker-selected').siblings().removeClass('picker-selected');
                        pickerValue[index] = {
                            value:selected.attr('data-val'),
                            text: selected.text(),
                            elem: selected
                        };
                        stepJump(index);
                        return;
                    }
                    that.scrollTo(0,height * unit,300);
                });
            });
        }
        // 数据联动，必须实现fetchData方法动态获取数据
        function stepJump(step){
            if(step >= steps-1){
                return;
            }
            if(typeof fetchData === 'function'){
                fetchData(step,pickerValue,function(data){
                    listCreate($pickerSlots[step+1],data);
                    scrollReset(step+1);
                    if(step<steps) stepJump(step+1);
                });
            }
        }
        // 滚动初始化，传入列表的索引值
        function scrollReset(index){
            var unit;
            if(index){
                unit = $($pickerSlots[index]).find('.picker-selected');
                pickerScrolls[index].refresh();
                pickerScrolls[index].scrollTo(0,0,0);
                pickerValue[index] = {
                    value: unit.attr('data-val'),
                    text: unit.text(),
                    elem: unit
                };
            }else{
                pickerValue = [];
                $.each(pickerScrolls,function(index,item){
                    unit = $($pickerSlots[index]).find('.picker-selected');
                    item.scrollTo(0,0,0);
                    item.refresh();
                    pickerValue[index] = {
                        value:unit.attr('data-val'),
                        text: unit.text(),
                        elem: unit
                    };
                });
            }
        }
        // 设置初始数据
        function setDefault(){
            if(!config.default) return;
            $.each(config.default,function(index,item){
                var unit = initialData[index].indexOf(item+"");
                var offset = unit * unitHeight;
                var hash = (item +"").split('-');
                pickerScrolls[index].scrollTo(0,-1*offset,0);
                $($pickerSlots[index]).find('.picker-item').eq(unit).addClass('picker-selected').siblings().removeClass('picker-selected');
                if(hash.length === 1){
                    pickerValue[index] = {
                        value: hash[0],
                        text: hash[0]
                    };
                }else{
                    pickerValue[index] = {
                        value: hash[0],
                        text: hash[1]
                    };
                }
            });
        }
        // 根据数据构造列表html
        function listCreate(dom, data){
            var $wrapper = $(dom).find('.picker-slot-wrapper');
            var labelBefore = "<li class='picker-item";
            var labelafter = "</li>";
            var html = '';
            $.each(data,function(index,item){
                var str = '',key,value;
                if(item.split('-').length === 1){
                    value = key = item;
                }else{
                    key = item.split('-')[0];
                    value = item.split('-')[1];
                }
                if(index === 0){
                    str = labelBefore + " picker-selected' ";
                }else{
                    str = labelBefore + "' ";
                }
                str +=  "data-val='"+key+"'>"+ value + labelafter;
                html += str;
            });
            $wrapper.html(html);
        }
        function open(data,callback){
            if(flag) return;
            flag = true;
            var html = '';
            if(typeof callback === 'function') callBack = callback;
            if(typeof data !== 'string'){
                initialData = data.data;
                config = data.config? data.config:{};
                html = template('templatePicker',data);
            }else{
                html = data;
            }
            $('.picker').html(html);
            $elem_mask.removeClass('hide');
            $elem_mask.on('touchmove',function(e){
                var $target = $(e.target);
                if($target.hasClass('mask')){
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            $('body').on('mousewheel',function(e){
                e.preventDefault();
                e.stopPropagation();
            });
            pickerInit();
            setTimeout(function(){
                $elem_dialog.addClass('on');
            },80);
        }
        function close(callback){
            flag = false;
            $elem_dialog.removeClass('on');
            $elem_mask.addClass('hide');
            $elem_mask.off('touchmove');
            $('body').off('mousewheel');
            if(typeof callback === 'function') callback(pickerValue);
        }
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                flag = false;
                pickerScrolls = [];
                pickerValue = [];
                steps = 0;
                currentStep = 0;
                config = {
                    default:[]
                };
                $elem_mask = elem.elem;
                $elem_dialog = elem.elem.find('.dialog');
                $picker = elem.elem.find('.picker');
                elem.btnCancel.on('click',close);
                elem.btnConfirm.on('click',function(e){
                    close(callBack);
                });
            },
            methods:{
                open: open,
                close: close,
                // 自己实现的fn方法若保持链式，里面必须调用名为callback的方法，并传入一个数组用于渲染页面
                fetchData:function(fn){
                    fetchData = fn;
                }
            }
        };
    });
    components.register('confirm', function(){
        var flag = false;
        var $body;
        var $elem_mask;
        var $elem_dialog;
        var $elem_cancel;
        var $elem_check;
        var com_object;
        var cancelCallBack,checkCallBack;
        function open(msg,ckCallback,celCallBack){
            if(flag) return;
            flag = true;
            if(typeof ckCallback === 'function'){
                checkCallBack = ckCallback;
            }
            if(typeof celCallBack === 'function'){
                cancelCallBack = celCallBack;
            }
            com_object.confirm_msg = msg;
            $elem_mask.removeClass('hide');
            $elem_mask.on('touchmove',function(e){
                var $target = $(e.target);
                if($target.hasClass('mask')){
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            $body.on('mousewheel',function(e){
                e.preventDefault();
                e.stopPropagation();
            });
            setTimeout(function(){
                $elem_dialog.addClass('on');
            },80);
        }
        function close(callback){
            flag = false;
            $elem_dialog.removeClass('on');
            $elem_mask.addClass('hide');
            $elem_mask.off('touchmove');
            $body.off('mousewheel');
            if(typeof callback === 'function') callback();
        }
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                flag = false;
                $body = $('body');
                $elem_dialog = elem.find('.dialog');
                $elem_mask = elem.elem;
                $elem_cancel = elem.confirmCancel;
                $elem_check = elem.confirmCheck;
                com_object = object;
                $elem_cancel.on('click',function(e){
                    close(cancelCallBack);
                });
                $elem_check.on('click',function(e){
                    close(checkCallBack);
                });
            },
            methods:{
                open: open,
                close: close,
            }
        };
    });
    // 地址模块
    components.register('addressItem', function() {
        return {
            init: function(){
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.find(".member-address-item-edit a").on('click', function(e) {
                    e.stopPropagation();
                });
                elem.on('click', function(e) {
                    if (scope["chooseAddr"]) {
                        scope["callAddress"] = object;
                        scope["chooseAddr"] = false;
                        location.href = scope["addrCallBackURL"];
                    };
                });
                elem.del.on('click', function(e) {
                    e.stopPropagation();
                    toolObject.ajaxWrap({
                        url: globleURL.delMemberAddress.substr(0, globleURL.delMemberAddress.length-5) + "-" + object.addressId + '.html',
                        type: 'get',
                        data: {}
                    }, function(data){
                        if (data) {
                            data = JSON.parse(data);
                            if (data.error) {
                                globleElemt.popup.show(data.error);
                            }else {
                                globleElemt.popup.show(data.success);
                                elem.elem.slideUp(300, function() {
                                    elem.remove();
                                });
                            }
                        };
                    }, function(err) {
                        globleElemt.popup.show(error);
                    });
                });

                elem.default.on('click',function(e){
                    e.stopPropagation();
                    for (var i = 0; i < globleElemt.addressList.length; i++) {
                        var item = globleElemt.addressList[i];
                            if (globleObject.addressList[i] !== object) {
                                if (globleObject.addressList[i].default) {
                                    item.elem.removeClass("active");
                                    globleObject.addressList[i].default = false;
                                };
                            } else {
                                var disabled = 0;
                                if (!object.default) {
                                    disabled = 1;//设置默认
                                }
                                toolObject.ajaxWrap({
                                    url: globleURL.setDefaultAddress,
                                    type:'post',
                                    dataType: 'json',
                                    data:{
                                        'addr_id' : object.addressId,
                                        'disabled': disabled
                                    }
                                }, function(data) {
                                    globleElemt.popup.show(data.success);
                                    if (object.default) {
                                        elem.addClass("active");
                                    }else {
                                        elem.removeClass("active");
                                    };
                                }, function(err) {
                                    globleElemt.popup.show(err);
                                });
                            }
                    };
                });

            }
        }
    });

    // 微信地址选择模版
    components.register('wxAddress', function() {
        var callBack;
        return {
            init: function() {
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.on('click', function(e) {
                    if (typeof wx === "undefined") {
                        callBack(false);
                    } else {
                        globleElemt.mask.show(function(isTrue) {
                            if (isTrue) {

                                wx.ready(function(){
                                    wx.openAddress({
                                       success: function (data) {
                                            // 用户成功拉出地址
                                            toolObject.saveWXAddress(data, function(d) {
                                                callBack(true, data, d);
                                            });
                                        },
                                       cancel: function () {
                                            // 用户取消拉出地址
                                            callBack(false);
                                        }
                                    });
                                });
                            } else {
                                callBack(false);
                            }
                        }, '是否使用微信收货地址');
                    }
                });
            },
            methods: {
                callback: function(callback) {
                    callBack = callback;
                }
            }
        };
    });
    // 星星选择
    components.register('starList', function() {
        return {
            init: function() {
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.elem.find("i").on('click', function(e) {
                    elem.elem.find("i").removeClass("iconfont-star").addClass("iconfont-star-o");
                    var index = $(this).data('index');
                    object.value = parseInt(index) * 2;
                    for (var i = 0; i < index; i++) {
                        $(elem.elem.find("i")[i]).removeClass("iconfont-star-o").addClass("iconfont-star");
                    };
                });
            }
        }
    });

    // 上传图片控件
    components.register('uploadImgs', function() {
        return {
            init: function() {

                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.imageFile.callBack = function(fileString) {
                    var formData = new FormData();
                    formData.append('file', this.elem.prop('files')[0]);
                    toolObject.ajaxWrap({
                        url: globleURL.uploadFile,
                        type: 'post',
                        cache: false,
                        processData: false,
                        contentType: false,
                        data: formData
                    }, function(data){
                        data = JSON.parse(data);
                        if (data.msgid === null) {
                            elem.find(".upload-desc").show();
                            elem.find(".upload-img-preview").show();
                            object.imageFileId = data.data[0];
                            elem.imageFile.elem.parent().find(".upload-img-preview").css("backgroundImage", "url("+fileString+")").css("backgroundColor","#f5f5f5");
                            elem.addClass("uploaded");
                            if (elem.hasClass("upload-imgs-item1")) {

                                var item = elem.elem.parent().find(".upload-imgs-item2");

                                item.find(".upload-desc").show();
                                item.find(".upload-img-preview").show();

                            } else if (elem.hasClass("upload-imgs-item2")) {

                                var item = elem.elem.parent().find(".upload-imgs-item3");
                                item.find(".upload-desc").show();
                                item.find(".upload-img-preview").show();

                            }
                        };
                    }, function(err){

                    });
                };
                elem.imageFileIdLabel.on("click", function(e) {
                    if ($(".upload-desc", this).css("display") == "none") {
                        e.preventDefault();
                    };
                });
                elem.del.on("click", function(e) {
                    e.stopPropagation();
                    elem.removeClass("uploaded");
                    elem.imageFile.attr("type", "hidden").attr("type", "file");
                    object.imageFileId = "";
                    elem.imageFile.elem.parent().find(".upload-img-preview").css("backgroundImage", "").css("backgroundColor","");
                    var elesItem = elem.elem.parent().find(".upload-imgs-item").not(".uploaded").not(elem.elem);
                    elesItem.find(".upload-desc").hide();
                    elesItem.find(".upload-img-preview").hide();
                });
            }
        }
    });

    // 区域选择模版
    components.register('areaSelect', function() {
        var elem, object, setRule, productId = [];

        function createElement(list, callBack, cId, type) {
            elem.contentList.elem.html("");
            for (var i = 0; i < list.length; i++) {
                var province = list[i];
                if (province) {
                    // 获得到参数
                    var arr = province.split("\:");
                    var id = arr[1], index, name = arr[0];
                    if (arr.length == 3) {
                        index = arr[2];
                    };

                    // 生成element对象
                    var p = $("<div></div>", {
                        class: 'area-content-item flex-row-between'
                    });
                    var pN = $("<span></span>").text(name);
                    var pA = $("<span></span>");
                    pN.prependTo(p);
                    pA.appendTo(p);
                    p.appendTo(elem.contentList.elem);

                    // 给对应的element添加事件
                    p.on('click', function(e) {
                        // 首先是被选中的状态
                        $(".area-content-item.active").removeClass("active");
                        $(this.elem).addClass("active");
                        if (typeof(index) != "undefined" && typeof(object.shopN) === "undefined") {
                            // 地址列表移动
                            elem.contentList.elem.animate({marginLeft:'-10rem'},300, function() {
                                elem.contentList.elem.css("marginLeft", '0');
                            });
                        };

                        $(".area-item").removeClass("active");
                        callBack(this.name, this.id, this.index);


                    }.bind({name: name, id: id, elem: p, index: index}));
                    if (cId === '' + id) {
                        p.addClass('active');
                        if (type) {
                            switch(type)
                            {
                                case "province":
                                    object.provinceN = name;
                                    // object.province = id;
                                    object.cityIndex = index;
                                    // p.trigger("click");
                                    // return;
                                    break;
                                case "city":
                                    object.cityN = name;
                                    // object.city = id;
                                    object.areaIndex = index;
                                    // p.trigger("click");
                                    // return;
                                    break;
                                case "area":
                                    object.areaN = name;
                                    // object.area = id;
                                    if (typeof object.shopN !== "undefined") {
                                        // p.trigger("click");
                                        // return;
                                    };
                                    break;
                                default:
                                    break;

                            }
                        };
                    };
                };
            };

        }

        function createShopElement(list, callBack) {

            elem.contentList.elem.html("");
            for (var i = 0; i < list.length; i++) {
                var shop = list[i];
                if (shop) {
                    // 生成element对象
                    var p = $("<div></div>", {
                        class: 'area-content-item flex-row-between'
                    });
                    if (object.shop === '' + shop.region_id) {
                        p.addClass('active');
                        object.shopN = shop.local_name;
                    };
                    var pN = $("<span></span>").text(shop.local_name + "(" + shop.addr + ")");
                    var pA = $("<span></span>").text(shop.distance);
                    pN.prependTo(p);
                    pA.appendTo(p);
                    p.appendTo(elem.contentList.elem);

                    // 给对应的element添加事件
                    p.on('click', function(e) {
                        // 首先是被选中的状态
                        $(".area-content-item.active").removeClass("active");
                        $(this.elem).addClass("active");
                        $(".area-item").removeClass("active");
                        callBack(this.name, this.id, this.addr,this.shop);
                    }.bind({name: shop.local_name, id: shop.region_id, addr: shop.addr, elem: p, shop:shop}));
                }
            }
        }

        function addShop() {
            toolObject.getShopsByPSC(
                object.province,
                object.city,
                object.area,
                productId,
                function(data) {
                    createShopElement(data.data.region, function(name, id, addr,shopData) {
                        object.shopN = name;
                        object.shop = id;
                        object.shopDistance = addr;
                        object.shopData = shopData;

                        elem.shopN.elem.addClass("active");
                        elem.elem.hide();
                        if (scope['areaSelectCallBack']) {
                            scope["isLBS"] = false;
                            scope['areaSelectCallBack'](object);
                        };
                    });
                },function(err) {
                    createShopElement([]);
                });
        }

        function addArea(list) {
            createElement(list, function(name, id, index) {
                // 给对应的市设置值
                object.areaN = name;
                object.area = id;
                $.cookie("choice[areaId]", id);
                if (typeof object.shopN !== "undefined") {
                    object.shopN = '门店';
                    object.shop = '';

                    elem.shopN.addClass("active");
                    addShop();
                } else {
                    elem.areaN.elem.addClass("active");
                    elem.elem.hide();
                    if (scope['areaSelectCallBack']) {
                        scope["isLBS"] = false;
                        scope['areaSelectCallBack'](object);
                    };
                }

            }, object.area, 'area');

        }

        function addCity(list) {
            createElement(list, function(name, id, index) {
                // 给对应的市设置值
                object.cityN = name;
                object.city = id;
                $.cookie("choice[cityId]", id);
                object.areaN = '区';
                object.area = '';

                object.areaIndex = index;

                elem.areaN.elem.addClass("active");

                // 然后显示对应的区
                addArea(region_Data[2][index]);

            }, object.city, 'city');
        }

        // 模块添加内容状态
        function addProvince(list) {
            //todo
            elem.contentList.elem.css("width", '10rem');
            createElement(list, function(name, id, index) {
                // 给对应的省设置值
                object.provinceN = name;
                object.province = id;
                $.cookie("choice[provinceId]", id);
                object.cityN = '市';
                object.city = '';
                object.areaN = '区';
                object.area = '';

                object.cityIndex = index;

                elem.cityN.elem.addClass("active");
                // 然后显示对应的市的值
                addCity(region_Data[1][index]);
            }, object.province, 'province');
        }

        // 显示省数据和对应的样式
        // function setProvince() {

        // }
        // 显示市数据和对应的样式
        // 显示区数据和对应的样式

        return {
            methods: {
                callBack: function(callback) {
                    scope['areaSelectCallBack'] = callback;
                },
                setProvince: function(id, name) {
                    $(".area-item.active").removeClass("active");
                    elem.provinceN.elem.addClass("active");
                    if (id) {
                        object.province = id;
                        object.provinceN = name;
                    };
                    addProvince(region_Data[0]);
                },
                setCity: function(id, name) {

                    $(".area-item.active").removeClass("active");
                    elem.cityN.elem.addClass("active");
                    if (id) {
                        object.city = id;
                        object.cityN = name;
                    };
                    addCity(region_Data[1][object.cityIndex]);
                },
                setarea: function(id, name) {

                    $(".area-item.active").removeClass("active");
                    elem.areaN.elem.addClass("active");
                    if (id) {
                        object.area = id;
                        object.areaN = name;
                    };
                    addArea(region_Data[2][object.areaIndex]);
                },
                setShop: function() {
                    if (typeof object.shopN !== "undefined") {
                        $(".area-item.active").removeClass("active");
                        elem.shopN.elem.addClass("active");
                        addShop();
                    };
                },
                setProduct: function(proId) {
                    if(productId.indexOf(proId) < 0){
                        productId.push(proId);
                    }
                }
            },
            init: function() {
                elem = this.elem,
                object = this.object,
                setRule = this.setRule,
                globleObject = this.globleObject,
                globleElemt = this.globleElemt;
                // 模版初始化方法
                function init() {
                    // 区域选择插件隐藏
                    elem.elem.hide();
                    if ($.cookie("choice[provinceId]")) {
                        object.province = $.cookie("choice[provinceId]");
                        if ($.cookie("choice[cityId]")) {
                            object.city = $.cookie("choice[cityId]");
                            if ($.cookie("choice[areaId]")) {
                                object.area = $.cookie("choice[areaId]");
                            };
                        };
                    };
                    // 让省作为选中的状态
                    $(".area-item.active").removeClass("active");
                    elem.provinceN.elem.addClass("active");
                    if (object.province) {
                        elem.setProvince(object.province);
                        elem.setCity("");
                        if (object.city) {
                            elem.setCity(object.city);
                            elem.setarea("");
                            if (object.area) {
                                elem.setarea(object.area);
                                if (typeof object.shopN !== "undefined") {
                                    elem.setShop();
                                };
                                // if (object.shop && object.shop !== "0") {
                                //     elem.setShop();
                                // };
                            }
                        }
                    } else {
                        addProvince(region_Data[0]);
                    }
                }

                elem.provinceN.on('click', function(e) {
                    if (object.province != '') {

                        $(".area-item.active").removeClass("active");
                        elem.provinceN.elem.addClass("active");
                        addProvince(region_Data[0]);
                    };
                });

                elem.cityN.on('click', function(e) {
                    if (object.city != '') {
                        $(".area-item.active").removeClass("active");
                        elem.cityN.elem.addClass("active");
                        addCity(region_Data[1][object.cityIndex]);

                    };
                });

                elem.areaN.on('click', function(e) {
                    if (object.area !== '') {

                        $(".area-item.active").removeClass("active");
                        elem.areaN.elem.addClass("active");
                        addArea(region_Data[2][object.areaIndex]);
                    };
                });


                if (elem.shopN) {
                    elem.shopN.on('click', function(e) {
                        if (object.shop !== '') {

                            $(".area-item.active").removeClass("active");
                            elem.shopN.elem.addClass("active");
                            addShop();
                        };
                    });
                };

                elem.close.on('click', function(e) {
                    elem.elem.slideUp();
                });

                init();

            }

        }
    });
    function getParameters(str){
        var array = [];
        var id=null,hash=null;
        var hash_str="";
        if(str.indexOf('$') > -1){
            array = str.split('$');
            id = array[0];
            hash_str = array[1];
            hash = {};
            $.each(hash_str.split('&'),function(index,item){
                if(!item) return;
                var unit = item.split('=');
                hash[unit[0]] = unit[1];
            });
            hash.id = id;
            return hash;
        }else{
            if(str.indexOf('=') > -1){
                hash = {};
                $.each(str.split('&'),function(index,item){
                    var unit = item.split('=');
                    hash[unit[0]] = unit[1];
                });
                return hash;
            }else{
                id = str;
                return id;
            }
        }
    }
    // // 通过 exports 对外提供接口
    exports.init = function(){
        var router = new Router({
            '': function() {
                home.init();
            },
            '/search':function(){
                search.init();
            },
            '/cart': function() {
                cart.init();
            },
            '/cart/checkout':{
                '':function(){
                    checkout.init(false);
                },
                // 立即购买
                '/true':function(){
                    checkout.init(true);
                },
                '/coupon':function(){
                    checkout.init(false,'coupon');
                },
                '/coupon/:id':function(id){
                    checkout.init(false,'coupon',id);
                }
            },
            '/passport':{
                '':function(){
                    passport.init('login');
                },
                '/register':function(){
                    passport.init('register');
                },
                '/lost':function(){
                    passport.init('lost');
                },
                '/lost2':function(){
                    passport.init('lost2');
                },
                '/license':function(){
                    passport.init('license');
                },
            },
            '/coupon' : {
                '':function(){
                    coupon.init('valid');
                },
                '/valid':function(){
                    coupon.init('valid');
                },
                '/used':function(){
                    coupon.init('used');
                },
                '/expire':function(){
                    coupon.init('expire');
                },
                '/detail':{
                    '/:id':function(id){
                        coupon.init('detail',id);
                    }
                }
            },
            '/credit':{
                '':function(){
                    credit.init('');
                },
                '/history':function(){
                    credit.init('history');
                },
                '/note':function(){
                    credit.init('note');
                 }
            },
            '/product':{
                '/?([^\/]*)/?':function(str){
                    var hash = getParameters(str);
                    product.init(hash);
                }
            },
            '/member': {
                '':function(){
                    member.init();
                },
                '/ticket/:id':function(id){
                    ticket.init(id);
                },
                '/balance':function(){
                    memberBalance.init();
                },
                '/balance/detail' : function() {
                    memberBalance.init('detail');
                },
                'signin':function(){
                    memberSignIn.init();
                },
                '/discuss/:id': function(id) {
                    memberDisucss.init(id);
                },
                '/settings' : function() {
                    memberSettings.init();
                },
                '/settings/setname':function(){
                    memberSettings.init('setname');
                },
                '/settings/phonebinding':function(){
                    memberSettings.init('phonebinding');
                },
                '/settings/phonebinding2':function(){
                    memberSettings.init('phonebinding2');
                },
                '/settings/modifypass1':function(){
                    memberSettings.init('modifypass1');
                },
                '/settings/modifypass2':function(){
                    memberSettings.init('modifypass2');
                },
                '/settings/pay_passwd':{
                    '' : function(){
                        memberSettings.init('pay_passwd');
                    },
                    '/lost':function(){
                        memberSettings.init('pay_passwd_lost');
                    },
                    '/edit':function(){
                        memberSettings.init('pay_passwd_edit');
                    },
                    '/set':function(){
                        memberSettings.init('pay_passwd_set');
                    }
                }
            },
            '/member/deposit' :{
                '':function(){
                    memberDeposit.init();
                }
            },
            '/member/shopping/address' : function() {
                shoppingAddress.init();
            },
            '/member/shopping/addAddress' : function() {
                shoppingAddAddress.init();
            },
            '/member/shopping/editAddress/:id' : function(id) {
                shoppingEditAddress.init(id);
            },
            '/gallery/gallery/:id' : function(id) {
                gallery.init(id);
            },
            '/gallery/gallery/?([^\/]*)/?' : function(str) {
                var hash = getParameters(str);
                gallery.init(hash);
            },
            '/gallery/category' : function() {
                galleryCategory.init();
            },
            '/member/balance' : function() {
                balance.init();
            },
            '/comment/good/:id' : function(id) {
                commentGood.init(id);
            },
            '/branch/branch' : function() {
                branch.init();
            },
            '/branch/detail/:id' : function(id) {
                branchDetail.init(id);
            },
            '/branch/more/:id' : function(id) {
                branchMore.init(id);
            },
            '/branch/map/:id' : function(id) {
                branchMap.init(id);
            },
            '/location/citySelect' : function() {
                citySelect.init();
            },
            '/aftersale':{
                '':function(){
                    afterSale.init();
                },
                '/list':function(){
                    afterSale.init('list');
                },
                '/progress':{
                    '/:id': function(id){
                        afterSale.init('progress',id);
                    }
                },
                '/apply':{
                    '/:id':function(id){
                        afterSale.init('apply',id);
                    }
                }
            },
            '/member/memberCard' : function(){
                memberCard.init();
            },
            'member/favorite' : function(){
                favorite.init();
            },
            'member/footprint' : function(){
                footprint.init();
            },
            'member/orders' : function(){
                orders.init(true);
            },
            'member/orders/offline' : function() {
                orders.init(false);
            },
            'member/orders/logistic/?([^\/]*)/?' : function(id){
                logistic.init(id);
            },
            'member/orders/detail/:id' : function(id){
                ordersDetail.init(id);
            },
            'member/cancel/:id' : function(id) {
                orderCancel.init(id);
            },
            '/paycenter':{
                '/:id':function(id){
                    paycenter.init(id);
                },
                '/res/?([^\/]*)/?':function(str){
                    var hash = getParameters(str);
                    memberDeposit.init('res',hash);
                },
                '/result/:id':function(id){
                    paycenter.init(id,'result');
                },
                '/result_pay/:id':function(id){
                    paycenter.init(id,'result_pay');
                }
            },
            '/paystatus' : function() {
                paystatus.init();
            },
            // 自定义页面，放在最后防止其他已定义的路由冲突
            '/?([^\/]*)/?/:id':function(action,id){
                // var custompage = require('custompage');
                custompage.init(action,id);
            }
        }).configure({
            strict:false,
            notfound:function(){
                home.init();
            }
        });
        location.hash = location.hash ? location.hash:"/";
        FastClick.attach(document.body);
        // 全局定时器id，用于清除跨页的setInterval
        scope.timeId = [];
        router.init();
    };

    // 或者通过 module.exports 提供整个接口
    // module.exports =

});