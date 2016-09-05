define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var template = require('template');

    module.exports = {
        init: function(action) {
            switch (action){
                case 'setname':
                    domObject.doit('/member/settings/setname', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    elem.popup.show(data.success,1000,function(){
                                        history.back();
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'phonebinding':
                    domObject.doit('/member/settings/phonebinding', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    location.hash = "#/member/settings/phonebinding2";
                                }
                            });
                        });
                    });
                    break;
                case 'phonebinding2':
                    domObject.doit('/member/settings/phonebinding2', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    elem.popup.show(data.success,1000,function(){
                                        location.hash = "#/member/settings";
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'modifypass1':
                    domObject.doit('/member/settings/modifypass1', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;

                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    location.hash = "#/member/settings/modifypass2";
                                }
                            });
                        });
                    });
                    break;
                case 'modifypass2':
                    domObject.doit('/member/settings/modifypass2', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
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
                                        location.hash = "#/passport";
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'pay_passwd':
                    domObject.doit('/member/settings/pay_passwd', function(elem, object, setRule) {

                    });
                    break;
                case 'pay_passwd_lost':
                    domObject.doit('/member/settings/pay_passwd/lost', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    location.hash = "#/member/settings/pay_passwd/set";
                                }
                            });
                        });
                    });
                    break;
                case 'pay_passwd_edit':
                    domObject.doit('/member/settings/pay_passwd/edit', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
                        elem.formSubmit.on("click",function(e){
                            var $this = $(this);
                            if($this.hasClass("disabled")) return;
                            elem.formValidate.formSubmit(form, function(data){
                                if(data.success){
                                    elem.popup.show(data.success,1000,function(){
                                        location.hash = "#/member/settings/pay_passwd/set";
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'pay_passwd_set':
                    domObject.doit('/member/settings/pay_passwd/set', function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        // 表单提交
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
                                        location.hash = "#/member/settings";
                                    });
                                }
                            });
                        });
                    });
                    break;
                default:
                    domObject.doit('/member/settings', function(elem, object, setRule) {
                        var picker = {
                            data:[
                                ['1-男','0-女']
                            ]
                        };
                        function BirthDataCreate(){
                            var date = new Date();
                            var year = date.getFullYear();
                            var month = date.getMonth()+1;
                            var day = date.getDate();
                            var obj = {
                                data:[],
                                config:{
                                    default:[year+"-"+year+"年",month+"-"+month+"月",day+"-"+day+"日"]
                                }
                            };
                            // 根据当前日期设置初始化数据
                            var i,years=[],months=[],days=[];
                            for(i=1900;i<= date.getFullYear();i++){
                                years.push(i+"-"+i+"年");
                            }
                            for(i=1;i<=date.getMonth()+1;i++){
                                months.push(i+"-"+i+"月");
                            }
                            for(i=1;i<=date.getDate();i++){
                                days.push(i+"-"+i+"日");
                            }
                            obj.data = [years,months,days];
                            return obj;
                        }
                        function BirthDataChain(){
                            var map = [31,28,31,30,31,30,31,31,30,31,30,31];
                            var date = new Date();
                            var currentYear = date.getFullYear();
                            var currentMonth = date.getMonth()+1;
                            var currentDate = date.getDate();
                            // 必须传入callback方法
                            elem.picker.fetchData(function(step,data,callback){
                                var year = Number(data[0].value);
                                var month = Number(data[1].value);
                                var i,array;
                                if( (year%4 === 0 && year%100 !== 0) || year%400 === 0 ){
                                    map[1] = 29;
                                }else{
                                    map[1] = 28;
                                }
                                // 根据年份设置月
                                if(step === 0){
                                    array = [];
                                    if(year == currentYear){
                                        for(i=1; i<= currentMonth; i++){
                                            array.push(i+"-"+i+"月");
                                        }
                                    }else{
                                        for(i=1; i<=12; i++){
                                            array.push(i+"-"+i+"月");
                                        }
                                    }
                                    callback(array);
                                }
                                // 根据月份设置天
                                if(step === 1){
                                    array = [];
                                    if(month == currentMonth){
                                        for(i=1; i<=currentDate; i++){
                                            array.push(i+"-"+i+"日");
                                        }
                                    }else{
                                        for(i=1; i<=map[month-1]; i++){
                                            array.push(i+"-"+i+"日");
                                        }
                                    }
                                    callback(array);
                                }
                            });
                        }
                        var birthPickerData = BirthDataCreate();
                        
                        var btnLogout = elem.btnLogout;
                        elem.btnSex.on('click',function(){
                            elem.picker.open(picker,function(data){
                                toolObject.ajaxWrap({
                                    url:globleURL.saveSettings,
                                    data:{
                                        sex:data[0].value+'',
                                        type:2
                                    },
                                    type:'POST'
                                },function(re){
                                    re = JSON.parse(re);
                                    if(re.success){
                                        object.btnSex.sex = data[0].text;
                                    }
                                    if(re.error){
                                        elem.popup.show(re.error,1000);
                                    }
                                });
                            });
                        });
                        elem.btnBirth.on('click',function(){
                            if($(this).hasClass('disabled')) return;
                            BirthDataChain();
                            elem.picker.open(birthPickerData,function(data){
                                toolObject.ajaxWrap({
                                    url:globleURL.saveSettings,
                                    data:{
                                        b_year:data[0].value,
                                        b_month:data[1].value,
                                        b_day:data[2].value,
                                        type:3
                                    },
                                    type:'POST'
                                },function(re){
                                    re = JSON.parse(re);
                                    if(re.success){
                                        var month = data[1].value+"";
                                        var day = data[2].value+"";
                                        month = month.length === 1 ? "0"+month:month;
                                        day = day.length === 1 ? "0"+day:day;
                                        object.btnBirth.birth = data[0].value + "-"+ month+ "-" + day;
                                    }
                                    if(re.error){
                                        elem.popup.show(re.error,1000);
                                    }
                                });
                            });
                        });

                        if(btnLogout){
                            btnLogout.on('click',logout);
                        }
                        function logout(){
                            toolObject.ajaxWrap({
                                url:globleURL.logout
                            },function(re){
                                try{
                                    data = JSON.parse(re);
                                    if(data.error){
                                        elem.popup.show(data.error,1000);
                                    }
                                    if(data.success){
                                        location.hash = "#/member";
                                    }
                                }catch(e){
                                    location.hash = "#/member";
                                }
                            });
                        }
                    });
            }

        }
    };
});