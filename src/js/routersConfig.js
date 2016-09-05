// 路由配置
define(function(require, exports, module) {
    var postfix = ".html";
    var obj = {
        '/passport' : base_full + '/index.php/wap/passport',
        '/passport/register' : base_full + '/index.php/wap/passport-signup',
        '/passport/lost' : base_full + '/index.php/wap/passport-lost',
        '/passport/lost2' : base_full + '/index.php/wap/passport-lost2',
        '/passport/license' : base_full + '/index.php/wap/passport-license',
        '/coupon/valid': base_full + '/index.php/wap/member-card',
        '/coupon/expire': base_full + '/index.php/wap/member-card_expire',
        '/coupon/detail': base_full + '/index.php/wap/member-card_info',
        '/coupon/used': base_full + '/index.php/wap/member-card_used',
        '/credit': base_full + '/index.php/wap/member-point',
        '/credit/history': base_full + '/index.php/wap/member-point_history',
        '/credit/note': base_full + '/index.php/wap/member-point_note',
        '/search': base_full + '/index.php/wap/home-search',
        '/product': base_full + '/index.php/wap/product',
        '/cart' : base_full + '/index.php/wap/cart',
        '/cart/checkout' : base_full + '/index.php/wap/cart-checkout',
        '/cart/checkout/coupon' : base_full + '/index.php/wap/member-coupon_list_tpl',
        '/home' : base_full + '/index.php/wap/home',
        '/member' : base_full + '/index.php/wap/member',
        '/member/signin' : base_full + '/index.php/wap/member-signin',
        // 评论订单
        '/member/discuss' : base_full + '/index.php/wap/member-discuss',
        // 商品评论列表
        '/comment/good' : base_full + '/index.php/wap/product-goodsDiscuss',

        // 充值
        '/member/deposit' : base_full + '/index.php/wap/member-deposit',
        '/paycenter/deposit/res' : base_full + '/index.php/wap/paycenter-deposit_res',
        // 收获地址
        '/member/shopping/address' : base_full + '/index.php/wap/member-receiver',
        '/member/shopping/addAddress' : base_full + '/index.php/wap/member-add_receiver',
        '/member/shopping/editAddress' : base_full + '/index.php/wap/member-modify_receiver',

        '/member/settings' : base_full + '/index.php/wap/member-setting',
        '/member/ticket' : base_full + '/index.php/wap/member-ticket',
        '/member/settings/setname' : base_full + '/index.php/wap/member-set_name',
        '/member/settings/phonebinding' : base_full + '/index.php/wap/member-phone_binding',
        '/member/settings/phonebinding2' : base_full + '/index.php/wap/member-phone_binding2',
        '/member/settings/modifypass1' : base_full + '/index.php/wap/member-modify_password',
        '/member/settings/modifypass2' : base_full + '/index.php/wap/member-setting_set_passwd',
        '/member/settings/pay_passwd' : base_full + '/index.php/wap/member-setting_pay_passwd',
        '/member/settings/pay_passwd/edit' : base_full + '/index.php/wap/member-setting_edit_pay_passwd',
        '/member/settings/pay_passwd/lost' : base_full + '/index.php/wap/member-setting_lost_pay_passwd',
        '/member/settings/pay_passwd/set' : base_full + '/index.php/wap/member-setting_set_pay_passwd',
        '/paycenter':base_full + '/index.php/wap/paycenter',
        '/paycenter/result':base_full + '/index.php/wap/paycenter-result',
        '/paycenter/result_pay':base_full + '/index.php/wap/paycenter-result_pay',
        '/gallery/gallery' : base_full + '/index.php/wap/gallery',
        '/gallery/category' : base_full + '/index.php/wap/gallery-cat',
        '/member/balance' : base_full + '/index.php/wap/member-balance',
        '/member/balance/detail' : base_full + '/index.php/wap/member-balance_detail',
        '/branch/branch' : base_full + '/index.php/wap/branch',
        '/branch/detail' : base_full + '/index.php/wap/branch-detail',
        '/branch/more' : base_full + '/index.php/wap/branch-moresale',
        '/branch/map' : base_full + '/index.php/wap/branch-map',
        '/location/citySelect' : base_full + '/index.php/wap/location',
        '/aftersale' : base_full +'/index.php/wap/member-afterlist',
        '/aftersale/apply' : base_full + '/index.php/wap/member-add_aftersales',
        '/aftersale/progress' : base_full + '/index.php/wap/member-afterrec_info',
        '/aftersale/list' : base_full + '/index.php/wap/member-afterrec',
        '/aftersale/ajax' : base_full + '/index.php/wap/member-afterlist_ajax',
        '/member/memberCard' : base_full + '/index.php/wap/member-memberCard',
        '/member/favorite' : base_full + '/index.php/wap/member-favorite',
        '/member/footprint' : base_full + '/index.php/wap/member-footprint',
        '/member/orders' : base_full + '/index.php/wap/member-orders',
        '/member/orders/offline' : base_full + '/index.php/wap/member-orders-offline',
        '/member/orders/logistic' : base_full + '/index.php/wap/member-logistic',
        '/member/orders/detail' : base_full + '/index.php/wap/member-orderdetail',
        '/member/cancel' : base_full + '/index.php/wap/member-cancel',
        // 自定义页面，格式如下，实际路由是一个action配一个id标识，比如 activity/6,article/232
        '/activity': base_full + '/index.php/wap/activity',
        '/article': base_full + '/index.php/wap/article'

    };
    function getQuery(){
        var hash = location.hash;
        var array = [];
        var query_str="";
        if(hash.indexOf('?') > -1){
            array = hash.split('?');
            query_str = array[1];
            return query_str;
        }
        return query_str;
    }
    module.exports = {
        setUrl: function(key,hash,isCache){
            var query = getQuery();
            if (arguments.length === 2) {
                isCache = hash;
                hash = null;
            };
            var url = "";
            if(obj[key]){
                url = obj[key];
                if(hash !== null && hash !== void 0){
                    if( Object.prototype.toString.call(hash).slice(8,-1) === "Object" ){
                        if(hash.id){
                            url += "-" + hash.id;
                        }
                        url += postfix+"?";
                        for(var i in hash){
                            if(i != 'id') {
                                url += encodeURIComponent(i) + "=" + encodeURIComponent(hash[i]) +"&";
                            }
                        }
                        url = url.substr(0,url.length-1);
                        if(query)
                            url += "&"+getQuery();
                        if (!isCache) {
                            url += '&v=' + new Date().getTime();
                        }
                    }else{
                        url += "-" + hash + postfix;
                        if(query){
                            url += "?"+getQuery();
                            if (!isCache) {
                                url += '&v=' + new Date().getTime();
                            }
                        }else{
                            if (!isCache) {
                                url += '?v=' + new Date().getTime();
                            }
                        }
                    }
                }else{
                    url += postfix;
                    if (!isCache) {
                        url += "?";
                        if(query){
                            url += getQuery()+"&";
                        }
                        url += 'v=' + new Date().getTime();
                    }else{
                        if(query){
                            url += "?"+getQuery();
                        }
                    }
                }
                return url;
            }
            return false;
        }
    };
});

