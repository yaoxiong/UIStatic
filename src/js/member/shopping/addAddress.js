define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function() {
            domObject.doit('/member/shopping/addAddress', function(elem, object, setRule) {
                elem.areaSelect.callBack(function() {
                    object.formValidate.province = object.areaSelect.province;
                    object.formValidate.city = object.areaSelect.city;
                    object.formValidate.area = object.areaSelect.area;
                    object.formValidate.provinceN = object.areaSelect.provinceN;
                    object.formValidate.cityN = object.areaSelect.cityN;
                    object.formValidate.areaN = object.areaSelect.areaN;
                    object.formValidate.selectArea = object.areaSelect.provinceN + object.areaSelect.cityN + object.areaSelect.areaN;
                });
                elem.formValidate.selectArea.on('click', function(e) {
                    elem.areaSelect.show();
                });

                elem.formValidate.submit.on('click', function(e) {
                    if (!$(this).hasClass("disabled")) {

                        if (object.formValidate.zip) {
                            if (!/^[1-9][0-9]{5}$/.test(object.formValidate.zip)) {
                                elem.popup.show("邮编格式不正确，请重新填写。");
                                object.formValidate.zip = "";
                                return;
                            };

                        };
                        var data = {
                            'name': object.formValidate.name,
                            'mobile': object.formValidate.mobile,
                            'areaN': object.formValidate.areaN,
                            'area': object.formValidate.area,
                            'cityN': object.formValidate.cityN,
                            'city': object.formValidate.city,
                            'provinceN': object.formValidate.provinceN,
                            'province': object.formValidate.province,
                            'zip': object.formValidate.zip,
                            'addr': object.formValidate.addr,
                            'def_addr':0 //1默认收货地址 0不是默认
                        };

                        toolObject.ajaxWrap({
                            url: globleURL.saveRec,
                            type:'post',
                            data: data
                        }, function(data){
                            data = JSON.parse(data);
                            if (data.success) {
                                elem.popup.show(data.success);
                                location.href = "#/member/shopping/address";
                            } else {
                                elem.popup.show(data.error);
                            }
                        }, function(err) {
                            elem.popup.show(data.err);
                        });
                    };
                });


            });
        }
    };
});