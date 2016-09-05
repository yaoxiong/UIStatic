define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/member/ticket',id, function(elem, object, setRule) {
                var codeImg = elem.codeImg;
                var barcode = codeImg.iptBarcode.elem.val();
                var qrcode = codeImg.iptQrcode.elem.val();
                elem.codeImg.drawCode(barcode,qrcode);
            });
        }
    };
});