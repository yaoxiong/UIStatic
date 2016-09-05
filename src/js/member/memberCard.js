define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');

    require('qrcode');

    require('barcode');

    module.exports = {
        init: function() {
            domObject.doit('/member/memberCard', function(elem, object, setRule) {
                if(elem.wxcard){
                    elem.wxcard.on('click',function(){
                        location.href="weixin://";
                    });
                }
                if(elem.alipaycard){
                    elem.alipaycard.on('click',function(){
                        location.href="alipay://";
                    });
                }
                function getBarCode() {
                    toolObject.ajaxWrap({
                        url: globleURL.memberCard,
                        type: 'POST',
                        dataType: 'json',
                        data: {}
                    }, function(data) {
                        elem.codeImg.drawCode(data.data[0].code);
                    });
                }
                getBarCode();
                var timeId = setInterval(function() {
                    getBarCode();
                }, 1000 * 60);
                scope.timeId.push(timeId);
            });
        }
    };
});