define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var checkoutData = {
        shipping_type:'delivery',
        express:{},
        beginTime:null,
        endTime:null,
        ckCoupon:null,
        pickupTime:null,
        saved:false
    };
    function setMoney(val){
        val = val ? ""+val : "0";
        if(val.indexOf("¥") === 0 || val.indexOf("￥") === 0){
            val = val.slice(1);
        }
        var arr = val.split('.');
        if(!arr[1]){
            arr[1] = "00";
        }else{
            arr[1] += "0";
        }
        arr[1] = arr[1].substr(0,2);
        return "￥"+arr.join('.');
    }
    var timeTool = (function(){
        // time1 > time2 返回true, 否则返回false
        function timeCompare(time1,time2){
            var arr1 = time1.split(":");
            var arr2 = time2.split(":");
            var num1,num2;
            num1 = Number(arr1[0]);
            num2 = Number(arr2[0]);
            if(num1 === num2){
                num1 = Number(arr1[1]);
                num2 = Number(arr2[1]);
                if(num1 > num2){
                    return true;
                }
                return false;
            }else if(num1 > num2){
                return true;
            }else{
                return false;
            }
        }
        function formatDate(month,day){
            var arr;
            if(day){
                return month+"月"+day+"日";
            }else{
                arr = month.split(".");
                if(arr.length>2){
                    return arr[1]+"月"+arr[2]+"日";
                }
                return arr[0]+"月"+arr[1]+"日";
            }
        }
        function zeroize(num){
            num = Number(num);
            if(isNaN(num)) return;
            if(num < 0) return ""+num;
            return num < 10 ? "0" + num : ""+num;
        }
        function closet(time,begin,end){
            var beginArray = begin.split(":");
            var endArray = end.split(":");
            var timeArray= time.split(":");
            if(timeCompare(time,end) || timeCompare(begin,time)){
                return begin;
            }
            if(timeArray[0] == endArray[0]){
                if(Number(timeArray[1]) >= 30){
                    timeArray[1] = endArray[1];
                }else{
                    timeArray[1] = "30";
                }
            }else{
                if(Number(timeArray[1]) >= 30){
                    timeArray[0] = Number(timeArray[0])+1;
                    timeArray[1] = "00";
                }else{
                    timeArray[1] = "30";
                }
            }
            return timeArray.join(":");
        }
        function timeAdd(time){
            var arr = time.split(":");
            if(arr[1] === "00"){
                arr[1] = "30";
            }else{
                arr[1] = "00";
                arr[0] = Number(arr[0])+1;
            }
            return arr.join(":");
        }
        return {
            timeCompare: timeCompare,
            formatDate: formatDate,
            closet: closet,
            timeAdd: timeAdd,
            zeroize: zeroize
        };
    })();
    module.exports = {
        init: function(is_fastbuy,action,hash) {
            var glob = this;
            var fastbuy = is_fastbuy ? "true":null;
            if(action === 'coupon'){
                domObject.doit('/cart/checkout/coupon',hash,function(elem, object, setRule) {
                    checkoutData.saved = true;
                    function addCoupon(id,callback){
                        toolObject.ajaxWrap({
                            url:globleURL.checkout_addCoupon,
                            data:{
                                coupon:id,
                                is_fastbuy: "",
                                response_type: true
                            }
                        },function(re){
                            re = JSON.parse(re);
                            if(re.error){
                                elem.popup.show(re.error,1000);return;
                            }
                            if(re.success){
                                if(typeof callback === 'function')
                                    callback(re.data[0]);
                            }
                        });
                    }
                    if(hash){
                        elem.checkout_other_coupon.formSubmit.on('click',function(e){
                            var coupon = elem.checkout_other_coupon.ipt_otherCoupon.elem.val();
                            if(!coupon){
                                elem.popup.show("请输入券码",1000);
                                return;
                            }
                            addCoupon(coupon,function(data){
                                checkoutData.ckCoupon = data;
                                checkoutData.ckCoupon.type = "otherCoupon";
                                scope['ckCoupon'] = checkoutData.ckCoupon;
                                $.cookie('ckCoupon', JSON.stringify(checkoutData.ckCoupon));
                                location.href= scope.jumpUrl || "#/cart/checkout";
                            });
                        });
                    }else{
                        elem.checkout_coupon.elem.find('.coupon-item').on('click',function(){
                            var $this = $(this);
                            var coupon = $this.find('input[name=memc_code]').val();
                            addCoupon(coupon,function(data){
                                checkoutData.ckCoupon = data;
                                checkoutData.ckCoupon.type = "coupon";
                                scope['ckCoupon'] = checkoutData.ckCoupon;
                                $.cookie('ckCoupon', JSON.stringify(checkoutData.ckCoupon));
                                location.href= scope.jumpUrl || "#/cart/checkout";
                            });
                        });
                    }
                });
            }else{
                domObject.doit('/cart/checkout', fastbuy,function(elem, object, setRule) {
                    var checkout = {
                        variable:{},
                        btnModes:null,
                        inputs:{},
                        init:function(){
                            this.variableInit();
                            this.eventBinding();
                            this.addrInit();
                            this.pageInit();
                            checkoutData.saved = false;
                        },
                        pageInit: function(){
                            function setPhone(val){
                                if(val.length<11){
                                    return "固定电话："+val;
                                }
                                return "手机："+val;
                            }
                            if (scope.callAddress) {
                                var addr = scope.callAddress;
                                var str = JSON.stringify({
                                    addr_id:addr.addressId,
                                    area:addr.area
                                });
                                object.ckAddress.address = addr.addressStr;
                                object.ckAddress.name = addr.name;
                                object.ckAddress.phone = setPhone(addr.mobile);
                                object.ckAddress.ipt_addr_id = addr.addressId;
                                object.ckAddress.ipt_addr_info = addr.addressStr;

                                if(this.inputs['address'].value !== str){
                                    this.inputs['address'].value = str;
                                    this.setExpressData();
                                    $.cookie("choice[addr_id]", addr.addressId);
                                    $.cookie("choice[addr_info]", addr.addressStr);
                                }
                            }
                            if(checkoutData.saved && checkoutData.express){
                                this.setExpress(JSON.stringify(checkoutData.express));
                            }
                            checkoutData.ckCoupon = checkoutData.ckCoupon || $.cookie('ckCoupon')||"";
                            var check_coupon;
                            if(checkoutData.ckCoupon){
                                checkoutData.ckCoupon = typeof checkoutData.ckCoupon === "string" ? JSON.parse(checkoutData.ckCoupon):checkoutData.ckCoupon;
                                if(checkoutData.ckCoupon.type === "coupon"){
                                    object.ckCoupon.couponName = checkoutData.ckCoupon.name;
                                    elem.ckCoupon.couponName.removeClass('placeholder');
                                    elem.ckOtherCoupon.elem.addClass('placeholder');
                                    check_coupon = this.inputs['coupon'];

                                    check_coupon.checked = true;
                                    // $(check_coupon).trigger('change');
                                }else{
                                    object.ckOtherCoupon.couponName = checkoutData.ckCoupon.name;
                                    elem.ckOtherCoupon.couponName.removeClass('placeholder');
                                    elem.ckCoupon.elem.addClass('placeholder');
                                    check_coupon = this.inputs['otherCoupon'];
                                    check_coupon.checked = true;
                                    // $(check_coupon).trigger('change');
                                }
                                this.getCartTotal();

                            }
                        },
                        variableInit:function(){
                            var that = this;
                            this.btnModes = elem.ckDelivery.find('.btn-mode');
                            var inputs = elem.checkout.elem.find('input,textarea');
                            $.each(inputs,function(index,item){
                                var $item = $(item);
                                var name = $item.attr('name');
                                that.inputs[name] = item;
                            });
                        },
                        // 门店自提初始化
                        addrInit:function(){
                            var that = this;
                            (function getAddr(){
                                object.ckDelivery.ipt_provinceId = object.areaSelect.province = $.cookie("choice[provinceId]")||"";
                                object.ckDelivery.ipt_cityId = object.areaSelect.city = $.cookie("choice[cityId]")||"";
                                object.ckDelivery.ipt_areaId = object.areaSelect.area = $.cookie("choice[areaId]")||"";
                                object.ckDelivery.ipt_shopId = object.areaSelect.shop = $.cookie("choice[shopId]")||"";
                                object.ckDelivery.shopDistance = object.areaSelect.shopDistance = $.cookie("choice[shopAddr]")||"";
                                object.ckDelivery.ipt_shopName = object.areaSelect.shopN = $.cookie("choice[shopName]")||"";

                                checkoutData.beginTime = $.cookie("choice[beginTime]")||"";
                                checkoutData.endTime = $.cookie("choice[endTime]")||"";
                                object.ckDelivery.shipping_type = checkoutData.shipping_type = $.cookie("choice[shipping_type]") || checkoutData.shipping_type;

                                if(!object.areaSelect.shopN){
                                    object.ckDelivery.shopName = '请选择门店';
                                    elem.ckDelivery.shopName.addClass('placeholder');
                                    elem.ckDelivery.selfTakeOffVal.addClass('hide');
                                }else{
                                    object.ckDelivery.shopName = object.areaSelect.shopN;
                                    object.ckDelivery.shopDistance = object.areaSelect.shopDistance;
                                    elem.ckDelivery.shopName.removeClass('placeholder');
                                    elem.ckDelivery.selfTakeOffVal.removeClass('hide');
                                }
                            })();
                            if(checkoutData.shipping_type=='self'){
                                that.setDelivery('pickup');
                                if(checkoutData.pickupTime){
                                    this.pickerTimeSet(checkoutData.pickupTime);
                                }
                                if(this.checkPickup()){
                                    that.getPayment();
                                }
                            }
                            elem.areaSelect.callBack(function() {
                                $.cookie("choice[provinceId]", object.areaSelect.province);
                                $.cookie("choice[cityId]", object.areaSelect.city);
                                $.cookie("choice[areaId]", object.areaSelect.area);
                                $.cookie("choice[shopId]", object.areaSelect.shop);
                                $.cookie("choice[shopName]", object.areaSelect.shopN);
                                $.cookie("choice[shopAddr]", object.areaSelect.shopDistance);
                                checkoutData.beginTime = object.areaSelect.shopData.business_begintime;
                                checkoutData.endTime = object.areaSelect.shopData.business_endtime;
                                $.cookie("choice[beginTime]", checkoutData.beginTime);
                                $.cookie("choice[endTime]", checkoutData.endTime);

                                object.ckDelivery.shopName = object.areaSelect.shopN;
                                elem.ckDelivery.shopName.removeClass('placeholder');
                                object.ckDelivery.shopDistance = object.areaSelect.shopDistance;
                                elem.ckDelivery.selfTakeOffVal.removeClass('hide');
                                // that.checkStore();
                                glob.init(fastbuy);
                            });
                        },
                        eventBinding:function(){
                            var that = this;
                            this.btnModes.on('click',function(e){
                                var $this = $(this);
                                var tab = $this.attr('data-tab');
                                that.setDelivery(tab);
                                glob.init(fastbuy);
                            });
                            if (elem.ckAddress) {
                                elem.ckAddress.callback(function(isChangeWX, data, d) {
                                    if (isChangeWX) {
                                        if (d.success) {
                                            var addStr = data.provinceName + data.cityName;
                                            if (data.countryName) {
                                                addStr += data.countryName;
                                            };
                                            addStr += data.detailInfo;
                                            var addId = d.data[0]["addr_id"];

                                            object.ckAddress.address = addStr;
                                            object.ckAddress.name = data.userName;
                                            object.ckAddress.phone = data.telNumber;
                                            object.ckAddress.ipt_addr_id = addId;
                                            object.ckAddress.ipt_addr_info = addStr;
                                            this.inputs['address'].value = JSON.stringify({
                                                addr_id:addId,
                                                area:d.data[0]["areaId"]
                                            });
                                            $.cookie("choice[addr_id]", addId);
                                            $.cookie("choice[addr_info]", addStr);
                                        };
                                    } else {
                                        scope["chooseAddr"] = true;
                                        scope["addrCallBackURL"] = location.hash;
                                        location.href = "#/member/shopping/address";
                                    }
                                });
                            }
                            elem.ckExpress.type.on('click',function(){
                                if(!that.checkAddress()) return;
                                that.getExpressPicker();
                            });
                            var header = elem.checkout.elem.find('.checkout-header');
                            var headerCheckbox = elem.checkout.elem.find('.checkout-header input[type=checkbox]');

                            header.on('click',function(e){
                                var $this = $(e.target);
                                var checkbox = $this.find('input[type=checkbox]');
                                if(checkbox.length){
                                    checkbox[0].checked = !checkbox[0].checked;
                                    checkbox.trigger('change');
                                }
                            });
                            headerCheckbox.on('change',function(e){
                                var $this = $(e.target);
                                var parent = $this.closest('.well');
                                if(this.checked){
                                    this.value="true";
                                    parent.removeClass('checkout-disabled');
                                }else{
                                    this.value="";
                                    parent.addClass('checkout-disabled');
                                }
                            });
                            if (elem.ckDelivery.areaShop) {
                                elem.ckDelivery.areaShop.on('click', function(e) {
                                    elem.areaSelect.show();
                                });
                            }
                            if (elem.ckDelivery.pickupTime) {
                                elem.ckDelivery.pickupTime.on('click', function(e) {
                                    if(!checkoutData.beginTime||!checkoutData.endTime){
                                        elem.popup.show('请先选择门店！',1000);
                                        return;
                                    }
                                    that.getShopTimePicker(checkoutData.beginTime,checkoutData.endTime);
                                });
                            }
                            function redirect(path){
                                scope.jumpUrl = location.hash;
                                location.href = path;
                            }
                            $(this.inputs['coupon']).on('change',function(e){
                                if(!that.checkNotEmpty(true)) return;
                                var $this = $(this);
                                var parent = $this.closest('.flex-row-between');
                                if(parent.hasClass('placeholder')){
                                    this.checked = false;return;
                                }else{
                                    if(this.checked){
                                        if(!checkoutData.ckCoupon)
                                            redirect("#/cart/checkout/coupon");
                                    }else{
                                        that.removeCoupon('coupon',function(){
                                            object.ckCoupon.couponName="请选择优惠券";
                                            elem.ckCoupon.couponName.elem.addClass('placeholder');
                                        });
                                    }
                                }
                            });
                            $(this.inputs['otherCoupon']).on('change',function(e){
                                if(!that.checkNotEmpty(true)) return;
                                var $this = $(this);
                                var parent = $this.closest('.flex-row-between');
                                if(parent.hasClass('placeholder')){
                                    this.checked = false;return;
                                }else{
                                    if(this.checked){
                                        if(!checkoutData.ckCoupon)
                                            redirect("#/cart/checkout/coupon/other");
                                    }else{
                                        that.removeCoupon('otherCoupon',function(){
                                            object.ckOtherCoupon.couponName="请输入优惠券码";
                                            elem.ckOtherCoupon.couponName.elem.addClass('placeholder');
                                        });
                                    }
                                }

                            });
                            if(elem.ckCoupon){
                                elem.ckCoupon.couponName.on('click',function(e){
                                    if(!that.checkNotEmpty(true)) return;
                                    if(!$(this).closest('.flex-row-between').hasClass('placeholder'))
                                        redirect("#/cart/checkout/coupon");
                                });
                            }
                            if(elem.ckOtherCoupon){
                                elem.ckOtherCoupon.couponName.on('click',function(e){
                                    if(!that.checkNotEmpty(true)) return;
                                    if(!$(this).closest('.flex-row-between').hasClass('placeholder'))
                                        redirect("#/cart/checkout/coupon/other");
                                });
                            }
                            if(elem.ckExchange){
                                elem.ckExchange.elem.find('input[type=checkbox]').on('change',function(e){
                                    if(!that.checkNotEmpty(true)){
                                        this.checked = !this.checked;
                                        return;
                                    }
                                    var $this = $(this);
                                    checkoutData.isExchange = this.checked;
                                    $this.closest('.flex-row-between').toggleClass('placeholder');
                                    that.getCartTotal();
                                });
                                elem.ckExchange.elem.on('click',function(e){
                                    if(!that.checkNotEmpty(true)) return;
                                    if(e.target.tagName === "INPUT") return;
                                    var $this = $(this);
                                    var input = $this.find('input[type=checkbox]');
                                    input[0].checked = !input[0].checked;
                                    input.trigger('change');
                                });
                            }
                            elem.ckPayment.elem.on('click',function(e){
                                var $target = $(e.target);
                                var $item = $target.closest('.checkout-pay-item');
                                if($item.length){
                                    var input = $item.find('input[type=radio]');
                                    if(!input[0].checked){
                                        input[0].checked = true;
                                        checkoutData.payment = JSON.parse(input[0].value);
                                        that.getCartTotal();
                                    }
                                }
                            });
                            if(elem.ckInvoice){
                                elem.ckInvoice.elem.find('.btn-mode').on('click',function(e){
                                    var $this = $(this);
                                    var tab = $this.attr('data-tab');
                                    $this.addClass('on').siblings().removeClass('on');
                                    if(tab == 'com'){
                                        elem.ckInvoice.invoiceTitle.elem.removeClass('hide');
                                        object.ckInvoice.ipt_taxType = "company";
                                    }else{
                                        elem.ckInvoice.invoiceTitle.elem.addClass('hide');
                                        object.ckInvoice.ipt_taxType = "personal";
                                    }
                                });
                                elem.ckInvoice.taxContent.on('click',function(){
                                    var picker = $('#invoiceSelect').html();
                                    elem.picker.open(picker,function(data){
                                        data = data[0];
                                        object.ckInvoice.taxContent = $.trim(data.text);
                                        object.ckInvoice.ipt_taxContent = data.value;
                                        elem.ckInvoice.taxContent.removeClass('placeholder');
                                    });
                                });
                            }
                            elem.formSubmit.elem.on('click',function(e){
                                that.orderCreate();
                            });
                        },
                        removeCoupon:function(type,callback){
                            var that = this;
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_removeCoupon,
                                data:{
                                    cpn_ident: checkoutData.ckCoupon.obj_ident,
                                    response_type:true
                                },
                                type:"POST"
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error,1000);
                                    return;
                                }
                                if(re.success){
                                    checkoutData.ckCoupon = null;
                                    scope['ckCoupon'] = null;
                                    $.cookie('ckCoupon',"");
                                    elem.ckCoupon.removeClass('placeholder');
                                    elem.ckOtherCoupon.removeClass('placeholder');
                                    that.getCartTotal();
                                    if(typeof callback === 'function') callback(re);
                                }
                            });
                        },
                        getPayment:function(){
                            var that = this;
                            var shipping ;
                            if(checkoutData.shipping_type==='self'){
                                shipping = this.inputs['self_shipping'].value;
                            }else{
                                shipping = JSON.stringify(checkoutData.express);
                                if(!shipping){
                                    elem.popup.show('请先选择快递方式！');
                                    return;
                                }
                            }
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_payement,
                                data:{
                                    shipping:shipping
                                },
                                type:"POST"
                            },function(re){
                                re = JSON.parse(re);
                                if(re.success){
                                    var html = re.data[0].html;
                                    var ckMain = elem.ckPayment.elem.find('.checkout-main');
                                    var ckBottom = elem.ckPayment.elem.find('.checkout-bottom');
                                    if(ckMain.length){
                                        ckMain.remove();
                                    }
                                    if(ckBottom.length){
                                        ckBottom.remove();
                                    }
                                    elem.ckPayment.elem.append(html);
                                    that.paymentInit();
                                }
                            });
                        },
                        paymentInit:function(){
                            var that = this;
                            var payItem = elem.ckPayment.find('.checkout-pay-item');
                            if(!payItem.length) return;
                            $.each(payItem,function(index,item){
                                var $item = $(item);
                                var input = $item.find('input[type=radio]')[0];
                                if(input.checked){
                                    checkoutData.payment = JSON.parse(input.value);
                                    that.getCartTotal();
                                }
                            });
                        },
                        getShopTimePicker:function(begin,end){
                            var that = this;
                            var today = new Date();
                            var picker = this.ShopTimeCreate(begin,end).pickerData;
                            elem.picker.fetchData(function(step,data,callback){
                                var date = data[0].value.split('.');
                                if(today.getDate() == date[2]){
                                    callback(that.ShopTimeCreate(begin,end).pickerTime);
                                }else{
                                    callback(that.getTimeArray(begin,end));
                                }
                            });
                            elem.picker.open(picker,function(data){
                                checkoutData.pickupTime = data;
                                that.pickerTimeSet(data);
                            });
                        },
                        pickerTimeSet:function(data){
                            object.ckDelivery.ipt_preDate = data[0].value.split(".").join("-");
                            object.ckDelivery.ipt_preTime = data[1].value;
                            object.ckDelivery.shopPickupTime = data[0].text+" "+data[1].text;
                            elem.ckDelivery.shopPickupTime.removeClass('placeholder');
                            this.getPayment();
                        },
                        ShopTimeCreate:function(begin,end){
                            var date = new Date();
                            var curMonth = timeTool.zeroize(date.getMonth()+1);
                            var curDate = timeTool.zeroize(date.getDate());
                            var curHour = date.getHours();
                            var curMinutes = date.getMinutes();
                            var curDay = date.getFullYear()+ "." + curMonth + "." + curDate;
                            var curTime = curHour + ":" + curMinutes;
                            var firstTime,firstDate;
                            var temp;

                            if(timeTool.timeCompare(curTime,end)){
                                firstTime = begin;
                                curDate += 1;
                                date.setDate(curDate);
                                temp = date.getFullYear() + "." + timeTool.zeroize(date.getMonth()+1) + "." + timeTool.zeroize(date.getDate());
                                firstDate =  temp+"-"+timeTool.formatDate(temp);
                            }else{
                                firstTime = timeTool.closet(curTime,begin,end);
                                firstDate =  curDay+ "-" + timeTool.formatDate(curDay);
                            }
                            var pickerDate = [firstDate];
                            var pickerTime = [firstTime];
                            var str;
                            for(var i=1;i<7;i++){
                                date.setDate(date.getDate()+1);
                                curMonth = timeTool.zeroize(date.getMonth()+1);
                                curDay = date.getFullYear()+ "." + curMonth + "." + timeTool.zeroize(date.getDate());
                                str = curDay+"-"+timeTool.formatDate(curDay);
                                pickerDate.push(str);
                            }
                            pickerTime = this.getTimeArray(firstTime,end);
                            var obj = {
                                data:[pickerDate,pickerTime]
                            };
                            return {
                                pickerData: obj,
                                pickerDate:pickerDate,
                                pickerTime:pickerTime
                            };
                        },
                        getTimeArray:function(start,end){
                            var str = start;
                            var temp = [start];
                            while(timeTool.timeCompare(end,str)){
                                str = timeTool.timeAdd(str);
                                temp.push(str);
                            }
                            return temp;
                        },
                        getCartTotal:function(){
                            var that = this;
                            var baseData = {
                                "purchase[addr_id]":that.inputs["purchase[addr_id]"].value||"",
                                "md5_cart_info":that.inputs["md5_cart_info"].value||"",
                                "extends_args":that.inputs["extends_args"].value||"",
                                "payment[pay_app_id]":JSON.stringify(checkoutData.payment)||"",
                                "payment[currency]":$('input[name="payment[currency]"]').val()||"",
                                "province":"",
                                "city":"",
                                "area":"",
                                "shop":"",
                                "payItem":"on"
                            };
                            var extendData;
                            if(checkoutData.shipping_type === 'self'){
                                extendData = {};
                                extendData.shipping = that.inputs["self_shipping"].value||"";
                                extendData.address = JSON.stringify({
                                    addr_id:"",
                                    area:that.inputs["choice[areaId]"].value||""
                                });
                                extendData.province = that.inputs["choice[provinceId]"].value||"";
                                extendData.city = that.inputs["choice[cityId]"].value||"";
                                extendData.area = that.inputs["choice[areaId]"].value||"";
                                extendData.shop = that.inputs["choice[shopId]"].value||"";
                            }else{
                                extendData = {};
                                extendData.shipping = JSON.stringify(checkoutData.express);
                                extendData.address = that.inputs["address"].value||"";
                            }
                            $.extend(baseData,extendData);
                            if(fastbuy){
                                baseData['isfastbuy'] = 'true';
                            }
                            if(checkoutData.isExchange){
                                baseData["point[score]"] = that.inputs["point[score]"].value;
                            }
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_cartTotal,
                                data:baseData,
                                type:"POST"
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error);
                                }
                                if(re.success){
                                    var data = re.data.order_detail;
                                    object.ckProductList.price = setMoney(data.cost_item);
                                    object.ckPromotion.price = setMoney(Number(data.pmt_order) + Number(data.total_dis_money));
                                    object.ckPayment.price = setMoney(data.final_amount);
                                }
                            });
                        },
                        checkStore:function(){
                            var that = this;
                            var baseData = {
                                "purchase[addr_id]":that.inputs["purchase[addr_id]"].value||"",
                                "md5_cart_info":that.inputs["md5_cart_info"].value||"",
                                "extends_args":that.inputs["extends_args"].value||"",
                                "payment[currency]":$('input[name="payment[currency]"]').val()||"",
                                "province":"",
                                "city":"",
                                "area":"",
                                "shop":"",
                                "payItem":"on"
                            };
                            var extendData;
                            if(checkoutData.shipping_type === 'self'){
                                extendData = {};
                                extendData.shipping = that.inputs["self_shipping"].value||"";
                                extendData.address = JSON.stringify({
                                    addr_id:"",
                                    area:that.inputs["choice[areaId]"].value||""
                                });
                                extendData.province = that.inputs["choice[provinceId]"].value||"";
                                extendData.city = that.inputs["choice[cityId]"].value||"";
                                extendData.area = that.inputs["choice[areaId]"].value||"";
                                extendData.shop = that.inputs["choice[shopId]"].value||"";
                            }else{
                                extendData = {};
                                extendData.shipping = JSON.stringify(checkoutData.express);
                                extendData.address = that.inputs["address"].value||"";
                            }
                            $.extend(baseData,extendData);
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_checkStore,
                                data:baseData,
                                type:"POST"
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error);
                                }
                                if(re.code=="1"){
                                    elem.formSubmit.removeClass('disabled');
                                }else if(re.code=="0"){
                                    elem.popup.show(re.msg);
                                    elem.formSubmit.addClass('disabled');
                                }
                                if(re.success){

                                }
                            });
                        },
                        orderCreate:function(){
                            if(!this.checkNotEmpty(true)) return;
                            if(!this.checkPayment(true)) return;
                            var that = this;
                            var baseData = {
                                "purchase[addr_id]":that.inputs["purchase[addr_id]"].value||"",
                                "md5_cart_info":that.inputs["md5_cart_info"].value||"",
                                "extends_args":that.inputs["extends_args"].value||"",
                                "payment[pay_app_id]":JSON.stringify(checkoutData.payment)||"",
                                "payment[currency]":$('input[name="payment[currency]"]').val()||"CNY",
                                "payItem":"on",
                                "memo":that.inputs["memo"].value||""
                            };
                            var extendData;
                            if(checkoutData.shipping_type === 'self'){
                                extendData = {};
                                extendData.shipping = that.inputs["self_shipping"].value||"";
                                extendData.address = JSON.stringify({
                                    addr_id:"",
                                    area:that.inputs["choice[areaId]"].value||""
                                });
                                extendData.province = that.inputs["choice[provinceId]"].value||"";
                                extendData.city = that.inputs["choice[cityId]"].value||"";
                                extendData.area = that.inputs["choice[areaId]"].value||"";
                                extendData.shop = that.inputs["choice[shopId]"].value||"";
                                extendData.shopName = that.inputs["choice[shopName]"].value||"";
                                extendData.preDate = that.inputs["preDate"].value||"";
                                extendData.preTime = that.inputs["preTime"].value||"";
                            }else{
                                extendData = {};
                                extendData.shipping = JSON.stringify(checkoutData.express);
                                extendData.address = that.inputs["address"].value||"";
                            }
                            $.extend(baseData,extendData);
                            if(checkoutData.isExchange){
                                baseData["point[score]"] = that.inputs["point[score]"].value;
                            }
                            var tax = that.inputs["payment[is_tax]"];
                            if(tax && tax.checked){
                                if(!this.checkInvoice(true)) return;
                                baseData["payment[is_tax]"] = that.inputs["payment[is_tax]"].value;
                                baseData["payment[tax_type]"] = that.inputs["payment[tax_type]"].value;
                                baseData["payment[tax_company]"] = that.inputs["payment[tax_company]"].value || "";
                                baseData["payment[tax_content]"] = that.inputs["payment[tax_content]"].value || "";
                            }
                            if(fastbuy){
                                baseData['isfastbuy'] = 'true';
                            }
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_order_create,
                                data:baseData,
                                type:"POST"
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error);
                                }
                                if(re.success){
                                    elem.popup.show(re.success);
                                    checkoutData = {
                                        shipping_type:'delivery',
                                        express:{},
                                        beginTime:null,
                                        endTime:null,
                                        ckCoupon:null,
                                        pickupTime:null
                                    };
                                    $.cookie('ckCoupon',"");
                                    location.href="#/paycenter/"+re.data[0].orderId+"-true";
                                }
                            });
                        },
                        // pickup,express
                        setDelivery: function(type){
                            var $unit = elem.ckDelivery[type].elem;
                            $.each(this.btnModes,function(index,item){
                                var $item = $(item);
                                if($item.attr('data-tab')===type){
                                    $item.addClass('on').siblings().removeClass('on');
                                }
                            });
                            $unit.removeClass('hide').siblings().not('.checkout-header').addClass('hide');
                            if(type === 'pickup'){
                                checkoutData.shipping_type = 'self';
                                elem.ckAddress.elem.addClass('hide');
                                elem.ckExpress.elem.addClass('hide');
                            }else{
                                checkoutData.shipping_type = 'delivery';
                                elem.ckAddress.elem.removeClass('hide');
                                elem.ckExpress.elem.removeClass('hide');
                            }
                            $.cookie("choice[shipping_type]",checkoutData.shipping_type);
                            // this.checkStore();
                        },
                        getExpressPicker:function(){
                            var that = this;
                            var area = JSON.parse(this.inputs['address'].value).area;
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_delivery_change,
                                data:{
                                    area:area
                                },
                                type:'POST'
                            },function(re){
                                re = JSON.parse(re);
                                if(re.success){
                                    var picker = re.data[0].html;
                                    elem.picker.open(picker,function(data){
                                        var da = data[0].elem.attr('value');
                                        that.setExpress(da);
                                    });
                                }
                            });
                        },
                        setExpress:function(express){
                            var that = this;
                            toolObject.ajaxWrap({
                                url:globleURL.checkout_delivery_confirm,
                                data:{
                                    shipping:express
                                },
                                type:'POST'
                            },function(re){
                                re = JSON.parse(re);
                                da = JSON.parse(express);
                                if(re.success){
                                    that.setExpressData(da);
                                    checkoutData.express = da;
                                    that.getPayment();
                                    that.getCartTotal();
                                }
                                if(re.error){
                                    elem.popup.show(re.error,1000);
                                }
                            });
                        },
                        setExpressData:function(data){
                            if(data){
                                object.ckExpress.type = data.dt_name;
                                object.ckExpress.expressFee = setMoney(data.money);
                            }else{
                                object.ckExpress.type = "请选择";
                                object.ckExpress.expressFee = setMoney(0);
                            }
                        },
                        checkInvoice(isAlert){
                            var type = this.inputs["payment[tax_type]"].value;
                            var tax_company = this.inputs["payment[tax_company]"].value;
                            var tax_content = this.inputs["payment[tax_content]"].value;
                            if(type == 'company'){
                                if(!tax_company){
                                    if(isAlert) elem.popup.show('请填写公司抬头！',1000);
                                    return false;
                                }
                            }
                            if(!tax_content){
                                if(isAlert) elem.popup.show('请选择发票内容！',1000);
                                return false;
                            }
                            return true;
                        },
                        checkPayment:function(isAlert){
                            var bool = typeof checkoutData.payment === 'object' ? true:false;
                            if(!bool && isAlert){
                                elem.popup.show('请选择支付方式！',1000);
                            }
                            return bool;
                        },
                        checkAddress: function(isAlert){
                            var bool = this.inputs['address'].value? true:false;
                            if(!bool && isAlert){
                                elem.popup.show('请先填写地址！',1000);
                            }
                            return bool;
                        },
                        checkExpress:function(isAlert){
                            var bool = checkoutData.express.id ? true:false;
                            if(!bool && isAlert){
                                elem.popup.show('请先选择快递！',1000);
                            }
                            return bool;
                        },
                        checkPickup:function(isAlert){
                            if(!this.inputs['choice[shopId]'].value){
                                if(isAlert){
                                    elem.popup.show('请先选择门店！',1000);
                                }
                                return false;
                            }
                            if(!this.inputs['preDate'].value || !this.inputs['preTime'].value){
                                if(isAlert){
                                    elem.popup.show('请选择自提时间！',1000);
                                }
                                return false;
                            }
                            return true;
                        },
                        checkNotEmpty: function(isAlert){
                            // var complete = true;
                            if(checkoutData.shipping_type === 'delivery'){
                                if(!this.checkAddress(isAlert)) return false;
                                if(!this.checkExpress(isAlert)) return false;
                            }else{
                                if(!this.checkAddress(isAlert)) return false;
                                if(!this.checkPickup(isAlert)) return false;
                            }
                            return true;
                        }
                    };
                    checkout.init();

                });
            }
        }
    };
});