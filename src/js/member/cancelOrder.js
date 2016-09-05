define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/member/cancel',id, function(elem, object, setRule) {
                $('[type="radio"]').on('click', function(e) {
                    e.preventDefault();
                });
                $(".order-cancel-item").on('click', function(e) {
                    $(".order-cancel-item.act").removeClass("act");
                    $(this).addClass("act");
                    $('[type="radio"]', this).prop("checked", true);
                });

                elem.orderCancel.submit.on('click', function(e) {
                    if (object.orderCancel.result) {
                        toolObject.ajaxWrap({
                            url: globleURL.orderCancel,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                'order_cancel_reason[order_id]': id,
                                'order_cancel_reason[reason_type]': $('[type="radio"]', ".order-cancel-item.act").val(),
                                'order_cancel_reason[reason_desc]': object.orderCancel.result,
                            }
                        }, function(data) {
                            if (data.success) {
                                location.href = "#/member/orders";
                            } else {
                                elem.popup.show(data.error);
                            }
                        }, function(err) {

                        });
                    } else {
                        elem.popup.show("取消订单原因不能为空");
                    }
                });
            });
        }
    };
});