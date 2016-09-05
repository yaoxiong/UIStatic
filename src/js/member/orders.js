define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');
    var oEcstore = require('oEcstore');

    // 添加模版对象
    var components = require('components');

    var isloading = false;

    // 星星选择
    components.register('orderListItem', function() {
        return {
            init: function() {
                var elem = this.elem,
                    object = this.object,
                    setRule = this.setRule,
                    globleObject = this.globleObject,
                    globleElemt = this.globleElemt;
                elem.makeSure.on('click', function(e) {
                    toolObject.ajaxWrap({
                        url: globleURL.memberReceive,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'order_id': object.orderId
                        }
                    }, function(data) {
                        if (data.success) {
                            globleElemt.successReceive.setOrderId(object.orderId);
                            object.status = 11;
                            elem.logistic.hide();
                            elem.makeSure.hide();
                            elem.orderApp.elem.css("display", "inline-block");
                            globleElemt.ordersGorup.tocommentOrders.elem.trigger("click");
                            globleElemt.successReceive.show();
                        } else {
                            // globleObject.popup(data.error);
                        }
                    }, function(err) {

                    });
                });
                elem.pickedUp.on('click', function(e) {
                    globleElemt.shareQRcode.codeImg.drawCode($(this).data("pickupcode"));
                    globleElemt.shareQRcode.show();
                });
            }
        }
    });

    module.exports = {
        init: function(isOnline) {
            var orderUrl = '/member/orders';
            var onlineState = 'online';
            if (!isOnline) {
                orderUrl ='/member/orders/offline';
                onlineState = 'offline';
            };
            scope["orderNum"] = parseInt(scope["orderNum"]) + 1;
            scope["backHome"] = 0 - parseInt(scope["orderNum"]);
            domObject.doit(orderUrl, function(elem, object, setRule) {
                var setOrderList = function(pagecurrent, callback) {
                    toolObject.getOrderList({
                        'is_ajax': 'ajax',
                        'shopping_type': onlineState,
                        'nPage': pagecurrent
                    }, callback);
                }
                // 下拉加载
                $(window).unbind("scroll");
                $(window).scroll(function(e) {
                    var scrollTop = $(document.body).scrollTop();
                    var listHeight = $(".orders-list").height();
                    var view = $(window).height() - $(".layout-nav").height();
                    if (listHeight > view) {
                        if (listHeight - view - scrollTop <= 0) {
                            if ((parseInt(object.myorders.pagetotal) > parseInt(object.myorders.pagecurrent)) && (isloading == false)) {
                                isloading = true;
                                setOrderList(parseInt(object.myorders.pagecurrent) + 1, function(data){
                                    isloading = false;
                                    if (data) {
                                        object.myorders.pagecurrent = parseInt(object.myorders.pagecurrent) + 1;
                                        oEcstore.append($(".orders-list"), data.data[0].html);

                                    };
                                });
                                // setOrderList(orderFilter, function() {
                                //     isloading = false;
                                // }, parseInt(object.myorders.pagecurrent) + 1);
                            };
                        };
                    };
                });

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

                function filterOrder(status) {
                    for (var i = 0; i < object.ordersList.length; i++) {
                        var order = object.ordersList[i];
                        var orderEle = elem.ordersList[i];
                        if (status == 'all') {
                            orderEle.show();
                        } else {
                            if (order.status == status) {
                                orderEle.show();
                            } else {
                                orderEle.hide();
                            }
                        };
                    };
                }
                // 全部订单
                elem.ordersGorup.totalOrders.on('click', function(e) {
                    filterOrder("all");
                    elem.ordersGorup.attr("data-act", 1);
                });

                if (elem.ordersGorup.preingOrders) {

                    // 备货中
                    elem.ordersGorup.preingOrders.on('click', function(e) {
                        filterOrder(3);
                        elem.ordersGorup.attr("data-act", 2);
                    });

                    // 待自提
                    elem.ordersGorup.selfOrders.on('click', function(e) {
                        filterOrder(2);
                        elem.ordersGorup.attr("data-act", 3);
                    });
                } else {

                    // 待支付
                    elem.ordersGorup.topayOrders.on('click', function(e) {
                        filterOrder(14);
                        elem.ordersGorup.attr("data-act", 2);
                    });

                    // 待收货
                    elem.ordersGorup.tocheckOrders.on('click', function(e) {
                        filterOrder(16);
                        elem.ordersGorup.attr("data-act", 3);
                    });
                }

                // 待评价
                elem.ordersGorup.tocommentOrders.on('click', function(e) {
                    filterOrder(11);
                    elem.ordersGorup.attr("data-act", 4);
                });

            });
        }
    };
});