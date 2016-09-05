define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    // 获得到价格
    function getPrice(price) {
        var val = 0;
        if (price) {
            // val = price.substr(1);
            val = parseFloat(parseFloat(val).toFixed(2));
        };
        return val;
    }

    // 获取参数
    function getDeletParameters(goodsItem) {
        var data = {
            "obj_type": goodsItem.objType,
            "goods_ident": goodsItem.goodsIdent,
            "goods_id": goodsItem.goodsId,
            "min": goodsItem.minNum,
            "max": goodsItem.maxNum,
            "stock": goodsItem.stockNum,
            "modify_quantity": {
            },
            "response_type": true
        };
        data.modify_quantity[goodsItem.goodsIdent] = {
            "quantity": goodsItem.goodNum
        };
        return data;
    }

    // 删除
    function deleteGoods(goodsItem, callBack){
        toolObject.ajaxWrap({
            url: globleURL.cartRemove,
            type: "post",
            data: getDeletParameters(goodsItem)
        }, function(data) {
            callBack(data);
        }, function(err) {

        });
    }

    module.exports = {
        init: function() {
            var that = this;
            domObject.doit('/cart', function(elem, object, setRule) {
                elem.areaSelect.callBack(function() {
                    object.cart.province = object.areaSelect.province;
                    $.cookie("choice[provinceId]", object.cart.province);
                    object.cart.city = object.areaSelect.city;
                    $.cookie("choice[cityId]", object.cart.city);
                    object.cart.area = object.areaSelect.area;
                    $.cookie("choice[areaId]", object.cart.area);
                    object.cart.shop = object.areaSelect.shop;
                    $.cookie("choice[shopId]", object.cart.shop);
                    object.cart.provinceN = object.areaSelect.provinceN;
                    object.cart.cityN = object.areaSelect.cityN;
                    object.cart.areaN = object.areaSelect.areaN;
                    object.cart.shopName = object.areaSelect.shopN;
                    $.cookie("choice[shopName]", object.cart.shopName);
                    object.cart.shopDistance = object.areaSelect.shopDistance;
                    $.cookie("choice[shopAddr]", object.cart.shopDistance);
                    that.init();
                });

                if (elem.cart.areaShop) {

                    elem.cart.areaShop.on('click', function(e) {
                        elem.areaSelect.show();
                    });
                };

                if (object.ordergiftsItem && object.ordergiftsItem.length < 1) {
                    $('.cart-exchange-list[data-array="ordergiftsItem"]').hide();
                };

                function setCurrentAddress(addressStr, addressId) {
                    object.cart.currentAddress = addressStr;
                    object.cart.currentAddrID = addressId;
                    $.cookie("choice[addr_id]", addressId);
                    $.cookie("choice[addr_info]", addressStr);
                }
                // 如果是地址列表页跳转过来的就怎样怎样
                if (scope["callAddress"]) {
                    setCurrentAddress(scope["callAddress"].addressStr, scope["callAddress"].addressId);
                };
                // 送货上门调转到地址列表
                if (elem.cart.takeoff) {
                    elem.cart.takeoff.callback(function(isChangeWX, data, d) {
                        if (isChangeWX) {
                            if (d.success) {
                                var addStr = data.provinceName + data.cityName;
                                if (data.countryName) {
                                    addStr += data.countryName;
                                };
                                setCurrentAddress(addStr + data.detailInfo, d.data[0]["addr_id"]);
                            };
                        } else {
                            scope["chooseAddr"] = true;
                            scope["addrCallBackURL"] = '#/cart';
                            location.href = "#/member/shopping/address";
                        }
                    });
                };
                // 编辑和完成按钮
                elem.header.editBtn.on('click', function(e) {
                    if (object.header.editBtn.trim() == '完成') {
                        object.header.editBtn = '编辑';
                        elem.cart.cartBEdit.elem.removeClass('cart-brief-edit');
                    } else {
                        object.header.editBtn = '完成';
                        elem.cart.cartBEdit.elem.addClass('cart-brief-edit');
                    }
                });

                // 配送信息
                if (elem.cart.pickUp) {
                    elem.cart.pickUp.on('click', function(e) {
                        elem.cart.pickUp.elem.addClass('on');
                        elem.cart.selfTakeOff.elem.removeClass('on');

                        elem.cart.takeoff.removeClass("hide");
                        elem.cart.areaShop.addClass("hide");
                        elem.cart.selfTakeOffVal.elem.addClass('hide');
                        $.cookie("choice\[shipping_type\]", "delivery");
                        that.init();
                    });
                }
                if (elem.cart.selfTakeOff) {
                    elem.cart.selfTakeOff.on('click', function(e) {
                        elem.cart.selfTakeOff.elem.addClass('on');
                        elem.cart.pickUp.elem.removeClass('on');

                        elem.cart.takeoff.addClass("hide");
                        elem.cart.areaShop.removeClass("hide");
                        elem.cart.selfTakeOffVal.elem.removeClass('hide');
                        $.cookie("choice\[shipping_type\]", "self");
                        that.init();
                    });
                }

                if (object.cart.shopType) {
                    if (object.cart.shopType === "self") {

                        elem.cart.selfTakeOff.elem.addClass('on');
                        elem.cart.pickUp.elem.removeClass('on');

                        elem.cart.takeoff.addClass("hide");
                        elem.cart.areaShop.removeClass("hide");
                        elem.cart.selfTakeOffVal.elem.removeClass('hide');
                    };
                };

                // 删除按钮
                elem.cart.itemRemove.on('click', function(e) {
                    elem.mask.show('您确定要删除该商品？', function(isTrue) {
                        if (isTrue) {
                            var isNull = true;

                            if (object.goodsItem && object.goodsItem.length > 0) {

                                for (var i = 0; i < object.goodsItem.length; i++) {
                                    var goodItem = object.goodsItem[i];
                                    var goodItemElemN = elem.goodsItem[i].getName();
                                    if (goodItem.checkVal) {
                                        deleteGoods(goodItem, function(data) {
                                            data = JSON.parse(data);
                                            if (data.success) {
                                                var that = this;
                                                this.elem.slideUp(function() {
                                                    domObject.remove(that);
                                                });
                                                elem.popup.show(data.success);
                                                if (data.is_empty) {
                                                    object.cart.salePrice = "￥0.00";
                                                    object.cart.totalPrice = "￥0.00";
                                                    $(".cart-delivery").hide();
                                                    $(".bottom-nav").hide();
                                                } else {
                                                    object.cart.salePrice = data.sub_total.discount_amount_order;
                                                    object.cart.totalPrice = data.sub_total.promotion_subtotal;
                                                    var giftList = "";
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
                                                    domObject.html($(".order-gift-list"), giftList);
                                                }
                                            } else {
                                                elem.popup.show(data.error_msg);
                                            }
                                        }.bind(elem.goodsItem[i]));
                                    }else{
                                        isNull = false;
                                    };
                                };
                            };

                            if (isNull) {
                                elem.cart.cartEmpty.elem.addClass("show");
                            };
                        };
                    });
                });
                // 结算按钮
                elem.cart.itemClearing.on('click', function(e) {
                    location.href = "#/cart/checkout";
                });
                // 收藏按钮
                elem.cart.itemFavorites.on('click', function(e) {
                    if (object.cart.goodsItem && object.cart.goodsItem.length > 0) {
                        for (var i = 0; i < object.cart.goodsItem.length; i++) {
                            var gi = object.cart.goodsItem[i];
                            if (gi.good_type === "goods" && gi.checkVal) {
                                toolObject.addFavorite(gi.goodsId, function(data) {
                                    elem.popup.show(data.success);
                                }, function(err) {
                                    elem.popup.show(data.failed);
                                });
                            };
                        };
                    };
                    if (object.giftsItem && object.giftsItem.length > 0) {
                        for (var i = 0; i < object.giftsItem.length; i++) {
                            var gi = object.giftsItem[i];
                            if (gi.checkVal) {
                                toolObject.addFavorite(gi.goodsId, function(data) {
                                    elem.popup.show(data.success);
                                }, function(err) {
                                    elem.popup.show(data.failed);
                                });
                            };
                        };
                    };
                });

                // 全选按钮
                elem.cart.allCheck.on('click', function(e) {
                    var val = $(this).prop("checked");
                    if (elem.cart.goodsItem && elem.cart.goodsItem.length > 0) {
                        for (var i = 0; i < elem.cart.goodsItem.length; i++) {
                            var goodNum = elem.cart.goodsItem[i];
                            var goodObject = object.cart.goodsItem[i];
                            if (goodObject.good_type === "goods") {
                                if(goodObject.checkVal !== val) {
                                    goodNum.checkVal.elem.click();
                                    // goodObject.checkVal = val;
                                }
                            };
                        };
                    };

                    if (elem.giftsItem && elem.giftsItem.length > 0) {
                        for (var i = 0; i < elem.giftsItem.length; i++) {
                            var goodNum = elem.giftsItem[i];
                            var goodObject = object.cart.giftsItem[i];
                            if(goodObject.checkVal !== val) {
                                goodNum.checkVal.elem.click();
                                // goodObject.checkVal = val;
                            }
                        };
                    };
                });

                // 给属性设置规则
                // 共计数量
                setRule(object.cart, 'cartQ', function() {
                    var val = 0;
                    if (object.cart.goodsItem) {
                        for (var i = 0; i < object.cart.goodsItem.length; i++) {
                            var goodNum = object.cart.goodsItem[i];
                            if (goodNum.checkVal) {
                                val += parseInt(goodNum.goodNum);
                            };
                        };
                    }
                    return val;
                });
                setRule(object.cart, 'cartQT', function() {
                    var val = 0;
                    if (object.cart.goodsItem) {
                        for (var i = 0; i < object.cart.goodsItem.length; i++) {
                            var goodNum = object.cart.goodsItem[i];
                            if (goodNum.checkVal) {
                                val += parseInt(goodNum.goodNum);
                            };
                        };
                    }
                    return val;
                });
                // setRule(object.cart, 'totalPrice', function() {
                //     var totalPrice = 0;
                //     if (object.cart.goodsItem) {
                //         for (var i = 0; i < object.cart.goodsItem.length; i++) {
                //             var goodNum = object.cart.goodsItem[i];
                //             if (goodNum.checkVal) {
                //                 totalPrice += parseFloat(parseFloat(parseInt(goodNum.goodNum) * getPrice(goodNum.price)).toFixed(2));
                //             };
                //         };
                //     }
                //     return '￥ ' + parseFloat(totalPrice).toFixed(2);
                // });

                // 全选规则
                setRule(object.cart, 'allCheck', function() {
                    var val = true;
                    if (object.cart.goodsItem) {
                        for (var i = 0; i < object.cart.goodsItem.length; i++) {
                            var goodNum = object.cart.goodsItem[i];
                            if (goodNum.good_type === "goods") {
                                if (goodNum.checkVal == false) {
                                    val = false;
                                };
                            }
                        };

                    };
                    if (object.giftsItem) {
                        for (var i = 0; i < object.giftsItem.length; i++) {
                            var goodNum = object.giftsItem[i];
                            if (goodNum.checkVal == false) {
                                val = false;
                            };
                        };

                    };
                    return val;
                });

            });
        }
    };
});