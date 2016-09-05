define('toolObject', ['jquery', 'scope', 'baseObject'], function(require, exports, module) {

    var $ = require('jquery');

    var scope = require('scope');

    var baseObject = require('baseObject');

    module.exports = {
        ajaxWrap: function(data, sucss, fail){
            $.ajax(data).then(function(data) {
                if (data) {
                    try {
                        var d;
                        if( Object.prototype.toString.call(data).slice(8,-1) !== 'Object' ){
                            d = JSON.parse(data);
                        }else {
                            d = data;
                        }
                        if (d.msgid === 40302) {
                            location.href = "#/passport";
                            return;
                        }
                        if (sucss) {
                            sucss(data);
                        }
                    } catch(e) {
                        if (fail) fail(e);
                    }
                } else {
                    if (fail) fail();
                }
            }, function(err) {
                if (fail) fail(err);
            });
        },
        // 倒计时
        countdown: function(el, opt){
            opt = $.extend({
                start: 60,
                secondOnly: false,
                callback: null
            }, opt || {});
            var t = opt.start;
            var sec = opt.secondOnly;
            var fn = opt.callback;
            var d = +new Date();
            var diff = Math.round((d + t*1000) /1000);
            return timeout(el, diff, fn);

            function timeout(elem, until, fn) {
                var str = '',
                    started = false,
                    left = {d: 0, h: 0, m: 0, s: 0, t: 0},
                    current = Math.round(+new Date() / 1000),
                    data = {d: '天', h: '时', m: '分', s: '秒'};

                left.s = until - current;

                if (left.s <= 0) {
                    (typeof fn === 'function') && fn();
                    return;
                }
                if(!sec) {
                    if (Math.floor(left.s / 86400) > 0) {
                      left.d = Math.floor(left.s / 86400);
                      left.s = left.s % 86400;
                      str += left.d + data.d;
                      started = true;
                    }
                    if (Math.floor(left.s / 3600) > 0) {
                      left.h = Math.floor(left.s / 3600);
                      left.s = left.s % 3600;
                      started = true;
                    }
                }
                if (started) {
                  str += ' ' + left.h + data.h;
                  started = true;
                }
                if(!sec) {
                    if (Math.floor(left.s / 60) > 0) {
                      left.m = Math.floor(left.s / 60);
                      left.s = left.s % 60;
                      started = true;
                    }
                }
                if (started) {
                  str += ' ' + left.m + data.m;
                  started = true;
                }
                if (Math.floor(left.s) > 0) {
                  started = true;
                }
                if (started) {
                  str += ' ' + left.s + data.s;
                  started = true;
                }
                elem.innerHTML = str;
                return setTimeout(function() {timeout(elem, until,fn);}, 1000);
            }
        },
        /*
        * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
        * @param fn {function}  需要调用的函数
        * @param delay  {number}    延迟时间，单位毫秒
        * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
        * @return {function}实际调用函数
        */
        throttle : function (fn,delay, immediate, debounce) {
           var curr = +new Date(),//当前事件
               last_call = 0,
               last_exec = 0,
               timer = null,
               diff, //时间差
               context,//上下文
               args,
               exec = function () {
                   last_exec = curr;
                   fn.apply(context, args);
               };
           return function () {
               curr= +new Date();
               context = this,
               args = arguments,
               diff = curr - (debounce ? last_call : last_exec) - delay;
               clearTimeout(timer);
               if (debounce) {
                   if (immediate) {
                       timer = setTimeout(exec, delay);
                   } else if (diff >= 0) {
                       exec();
                   }
               } else {
                   if (diff >= 0) {
                       exec();
                   } else if (immediate) {
                       timer = setTimeout(exec, -diff);
                   }
               }
               last_call = curr;
           };
        },
        /*
        * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
        * @param fn {function}  要调用的函数
        * @param delay   {number}    空闲时间
        * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
        * @return {function}实际调用函数
        */
        debounce : function (fn, delay, immediate) {
           return this.throttle(fn, delay, immediate, true);
        },
        // 获取当前定位
        getLocation: function(sucss, fail, isenableHighAccuracy) {
            // scope["position"] = {
            //     longitude: '121.424363',
            //     latitude: '31.175943'
            // };
            if (!scope["position"]) {
                if (arguments.length < 3) {
                    isenableHighAccuracy = true;
                };
                var options = {
                    enableHighAccuracy: isenableHighAccuracy,
                    timeout: 5000
                };
                if (window.navigator.geolocation) {
                    window.navigator.geolocation.getCurrentPosition(function(position) {
                        scope["position"] = {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude
                        };
                        baseObject.getNearbyShops(scope["position"], sucss, fail);
                    }, function(err){
                        scope["position"] = {
                            longitude: '',
                            latitude: ''
                        };
                        baseObject.getNearbyShops(scope["position"], sucss, fail);
                    }, options);
                };

            } else {
                baseObject.getNearbyShops(scope["position"], sucss, fail);
            }
        },

        // 解析购物车商品数据
        getDeletParameters: function(goodsItem) {
            var is_selected = 0;
            if (goodsItem.checkVal) {
                is_selected = 1;
            };
            var data = {
                "obj_type": goodsItem.objType,
                "good_type": goodsItem.good_type,
                "min": goodsItem.minNum,
                "max": goodsItem.maxNum,
                "stock": goodsItem.stockNum,
                "is_selected": is_selected,
                "modify_quantity": {
                }
            };
            // 积分商品的传参
            if (goodsItem.good_type === "gift") {
                data.modify_quantity[goodsItem.goodsIdent]= goodsItem.goodNum;
                data["response_json"] = true;
            // 商品配件的传参
            } else if (goodsItem.good_type === "adjunct") {
                data.modify_quantity[goodsItem.goodsIdent] = {};

                data.modify_quantity[goodsItem.goodsIdent]["adjunct"] = [];

                data.modify_quantity[goodsItem.goodsIdent]["adjunct"][0] = {};
                data.modify_quantity[goodsItem.goodsIdent]["adjunct"][0][goodsItem.productId] = {
                    "quantity": goodsItem.goodNum
                };
                data["response_json"] = true;
            // 主商品配件的传参
            } else if (goodsItem.good_type === "goods") {
                data.modify_quantity[goodsItem.goodsIdent] = {};

                data.modify_quantity[goodsItem.goodsIdent] = {
                    "quantity": goodsItem.goodNum
                };

                data["goods_id"] = goodsItem.goodsId;
                data["goods_ident"] = goodsItem.goodsIdent;
                data["response_type"] = true;
            };
            return data;
        },

        // 获得到商品列表数据
        getGoods: function(data, sucss, fail) {
            this.ajaxWrap({
                url: globleURL.getGoods,
                type: 'POST',
                dataType: 'json',
                data: data
            }, function(data) {
                if (data.success) {
                    sucss(data);
                } else {
                    fail(data);
                };
            }, fail);
        },

        // 收藏api
        addFavorite: function(id, sucss, fail) {
            this.ajaxWrap({
                url: globleURL.addFavorite,
                data:{
                    gid:id,
                    type:'goods'
                },
                type:'POST'
            },function(re){
                try{
                    re = JSON.parse(re);
                    if (re.success) {
                        sucss(re);
                    }else{
                        fail(re);
                    };
                }catch(e) {
                    fail(e);
                }

            },function(err) {
                fail(err);
            });
        },

        // 根据省、市、区获得门店列表
        getShopsByPSC: function(province, city, area, productId, sucss, fail) {
            if (typeof productId === "function") {
                sucss = productId;
                fail = sucss;
                productId = [];
            };
            this.ajaxWrap({
                url: globleURL.getShopByPCA,
                data:{
                    province: province,
                    city: city,
                    area: area,
                    'product_ids': JSON.stringify(productId)
                },
                type:'POST',
                dataType: 'json'
            }, function(re) {
                if (re.success) {
                    sucss(re);
                } else {
                    fail(re);
                }
            }, function(err) {
                fail(err);
            })
        },

        // 生成购物车商品列表
        newGoodItem: function(data, index) {
           return ['<li class="goods-item" data-object="ordergiftItem' + index + '" data-mode="goodsI" data-init="true">',
                '<div class="goods-item-main">',
                    '<div class="goods-item-img">',
                      '<img src="' + data.thumbnail + '" alt="' + data.name + '">',
                    '</div>',
                    '<div class="goods-item-info">',
                        '<div class="goods-item-top">',
                          '<a href="javascript:void(0);"><p class="goods-item-title">' + data.name + '</p></a>',
                        '</div>',
                        '<div class="goods-item-bottom">',
                          '<p class="goods-item-spec"></p>',
                          '<p class="goods-item-price"><span data-proto="price" data-value="text">' + data.price + '</span></p>',
                            '<div class="goods-item-domain">',
                                '<div class="number-ipts">',
                                data.quantity,
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</li>'].join("");
        },

        // 保存第三方地址
        saveWXAddress: function(data, callback) {
            var dd = {
                    name: data.userName,
                    provinceN: data.provinceName,
                    cityN: data.cityName,
                    areaN: data.countryName,
                    addr: data.detailInfo,
                    zip: data.postalCode,
                    mobile: data.telNumber,
                    source: 'weixin'
                };
            this.ajaxWrap({
                url: globleURL.saveWXAddress,
                type: 'POST',
                dataType: 'json',
                data: dd
            }, function(data) {
                callback(data);
            }, function(e) {
                callback();
            });
        },

        // 获取订单列表翻页
        getOrderList: function(d, callback) {
            this.ajaxWrap({
                url: globleURL.getOrderList,
                type: 'POST',
                dataType: 'json',
                data: d
            }, function(data) {
                callback(data);
            }, function(e) {
                callback();
            })
        }

    };
});