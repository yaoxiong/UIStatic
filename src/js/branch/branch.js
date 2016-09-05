define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var oEcstore = require('oEcstore');

    var setShopList = function(list) {
        var html = '';
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            html += '<div class="well nearby-shop-item">';
            html += '<a href="#/branch/detail/' + item.local_id + '" >';
            html += '<div class="flex-row-between flex-center">';
            html += '<div class="-col-left"><img src="' + item.image + '" alt="" class="nearby-shop-item-img"></div>';
            html += '<div class="-col-content">';
            html += '<div class="nearby-shop-item-name">' + item.local_name + '</div>'
            html += '<div class="nearby-shop-item-scores"><div class="scores-wrapper scores-' + item.mark + '"><div class="scores-empty-stars"><i class="iconfont iconfont-star-o"></i><i class="iconfont iconfont-star-o"></i><i class="iconfont iconfont-star-o"></i><i class="iconfont iconfont-star-o"></i><i class="iconfont iconfont-star-o"></i></div><div class="scores-stars"><div class="scores-star-wrapper"><i class="iconfont iconfont-star"></i><i class="iconfont iconfont-star"></i><i class="iconfont iconfont-star"></i><i class="iconfont iconfont-star"></i><i class="iconfont iconfont-star"></i></div></div><div class="scores-value"><span class="scores-int">';
            html += Math.floor(parseFloat(item.mark));
            html += '</span><span class="scores-dot">.</span><span class="scores-decimal">';
            html += parseInt((parseFloat(item.mark) - Math.floor(parseFloat(item.mark))) * 10);
            html += '</span></div></div></div>';
            html += '<div class="nearby-shop-item-shop-time"><span class="label label-primary-light label-outline"><span class="budge2 ';
            if (item.local_status) {
                html += 'bc-in';
            }else{
                html += 'bc-out';
            };
            html += '">' + item.local_status_name + '</span></span><span class="nearby-shop-item-time-range">(' + item.business_begintime + '-' + item.business_endtime + ')</span></div>';
            html += '<div class="nearby-shop-item-address">地址：' + item.addr + '</div>';
            html += '</div>';
            html += '<div class="-col-right"><div class="nearby-shop-item-nav text-center"><div class="nearby-shop-item-nav-icon"><i class="iconfont iconfont-location-arrow"></i></div><div class="nearby-shop-item-nav-space">' + item.distance + '</div></div></div>';
            html += '</div>';
            html +='</a>';
            html += '</div>';
        };
        return html;
    };


    module.exports = {
        init: function() {
            domObject.doit('/branch/branch', function(elem, object, setRule) {
                var setShopData = function(data) {
                    object.nearbyShop.iscurrented = true;
                    $(".nearby-shop-glob").removeClass("empty");
                    if (data.msg_id == 0) {
                        object.nearbyShop.currentLocation = data.data.location_info;
                        if (data.data.shops.length >  0) {
                            elem.nearbyShop.noShops.elem.removeClass('show');
                        } else {
                            elem.nearbyShop.noShops.elem.addClass('show');
                        };
                        oEcstore.html(elem.nearbyShop.shopList, setShopList(data.data.shops));
                    };

                };
                // var setShops = function(longitude, latitude){
                //     toolObject.ajaxWrap({
                //         type: 'post',
                //         url: globleURL.getLocation,
                //         data: {
                //             longitude: longitude,
                //             latitude: latitude
                //         }
                //     },function(data) {
                //         setShopData(data);
                //     },function(err){
                //         object.nearbyShop.iscurrented = true;
                //     });
                // }

                function getCurrentLocation() {
                    scope["isLBS"] = true;
                    toolObject.getLocation(function(data){
                        // 获取了地址才能让自己选择
                        elem.nearbyShop.togglePostion.on('click', function(e) {
                            elem.areaSelect.elem.slideToggle();
                        });
                        setShopData(data);
                    }, function(err) {
                        object.nearbyShop.iscurrented = true;

                        // 获取了地址才能让自己选择
                        elem.nearbyShop.togglePostion.on('click', function(e) {
                            elem.areaSelect.elem.slideToggle();
                        });
                        $(".nearby-shop-glob").addClass("empty");
                    });
                }
                // 获取地址
                if (object.nearbyShop.iscurrented == 'false' && scope["isLBS"] == true) { //
                    getCurrentLocation();
                };

                var getShops = function(obj) {
                    toolObject.ajaxWrap({
                        type: 'post',
                        url: globleURL.getnearbyShopByArea,
                        data: {
                            province: obj.province,
                            provinceName: obj.provinceN,
                            city: obj.city,
                            cityName: obj.cityN,
                            area: obj.area,
                            areaName: obj.areaN,
                        }
                    },function(data) {
                        data = JSON.parse(data);
                        setShopData(data);
                    },function(err){
                        object.nearbyShop.iscurrented = true;
                    });

                }
                if (object.nearbyShop.iscurrented == 'false' && object.areaSelect.area && !scope["isLBS"]) {
                    // 获取了地址才能让自己选择
                    elem.nearbyShop.togglePostion.on('click', function(e) {
                        elem.areaSelect.elem.slideToggle();
                    });
                    getShops(object.areaSelect);
                };

                // 通过区域选择地址来加载门店
                elem.areaSelect.callBack(function(obj) {
                    getShops(obj);
                });

                elem.nearbyShop.currentPosition.on('click', function(e) {
                    getCurrentLocation();
                });

            });
        }
    };
});