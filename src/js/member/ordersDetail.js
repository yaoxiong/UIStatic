define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/member/orders/detail',id, function(elem, object, setRule) {
                // elem.orderDetail.commentNow.on('click', function(e) {
                //     location.href = "#/member/discuss/" + id;
                // });

                elem.shareQRcode.close.on('click', function(e) {
                    elem.shareQRcode.hide();
                });
                elem.successReceive.close.on('click', function(e) {
                    elem.successReceive.hide();
                });
                elem.successReceive.setOrderId = function(id) {
                    object.successReceive.orderId = id;
                };
                elem.successReceive.comment.on('click', function(e) {
                    location.href = "#/member/discuss/" + object.successReceive.orderId;
                });
                elem.orderDetail.makeSure.on('click', function(e) {

                    toolObject.ajaxWrap({
                        url: globleURL.memberReceive,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'order_id': id
                        }
                    }, function(data) {
                        if (data.success) {
                            console.log();
                            elem.successReceive.setOrderId(id);
                            $(".btn-group-justified").removeClass("order-status-receive").addClass("order-status-appraise");
                            elem.successReceive.show();
                        } else {
                            // globleObject.popup(data.error);
                        }
                    }, function(err) {

                    });
                });
                elem.orderDetail.pickedUp.on('click', function(e) {

                    elem.shareQRcode.codeImg.drawCode($(this).data("pickupcode"));
                    elem.shareQRcode.show();
                });
            });
        }
    };
});