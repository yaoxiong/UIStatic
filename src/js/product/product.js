define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var flexslider = require('flexslider');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');

    require('cookie');
    var productNum = {};
    module.exports = {
        init: function(hash) {
            var glob = this;
            var obj = {};
            var customShopId  = $.cookie("choice[shopId]");
            var shipping_type  = $.cookie("choice[shipping_type]");
            if(shipping_type==="self" && customShopId){
                if(typeof hash === 'string'){
                    obj.id = hash;
                    obj.customShopId = customShopId;
                    hash = obj;
                }else{
                    hash.customShopId = customShopId;
                }
            }
            domObject.doit('/product',hash,function(elem, object, setRule) {

                var Product = {
                    dom:{
                        elem:null,
                        object:null,
                        setRule:null,
                    },
                    productId:null,
                    // 商品规格
                    specInfo:null,
                    // 商品规格dom
                    $specList:null,
                    // 选中规格
                    specSelect:{
                        value:[],
                        dom:[]
                    },
                    // 当前规格
                    specCurrent:{
                        value:[],
                        dom:[]
                    },
                    inputs:{},
                    shipping_type:'delivery',
                    // 缓存jQuery对象
                    $body:null,
                    $bottomNav:null,
                    $productDetailWrapper: null,
                    $productImgWrapper: null,
                    $productBanner: null,
                    $productDetail: null,
                    $productTitle: null,
                    $productImgGuide: null,
                    $ptDetailSpec: null,
                    $ptDetailPromotion: null,
                    // 商品图片详情IScroll滚动对象
                    productImgScroll:null,
                    // 商品图片详情状态，false代表关闭状态
                    flag_imgView: false,
                    // 去除顶部栏的视窗高度
                    viewPortHeight: null,
                    dialogIntance: null,
                    $dialogHeader: null,
                    $dialogMain: null,
                    $dialogFooter: null,

                    init: function(elem, object, setRule){
                        this.domObjectInit(elem, object, setRule);
                        this.variableInit();
                        this.specStoreInit();
                        this.eventBinding();
                        this.addrInit();
                        this.setProductSpecInfo();
                        this.productImgWrapperInit();
                        this.addFootPrint();
                    },

                    domObjectInit: function(elem,object,setRule){
                        this.dom.elem = elem;
                        this.dom.object = object;
                        this.dom.setRule = setRule;
                    },

                    // 变量初始化
                    variableInit: function(){
                        var that = this;
                        var domElem = this.dom.elem;
                        this.$body = $('body');
                        var deviceHeight = this.$body.height();
                        var navHeight = $('.top-nav').height();
                        // dom元素绑定
                        this.$productDetailWrapper = domElem.productDetailWrapper.elem;
                        this.$productDetailTitle   = domElem.productDetailTitle.elem;
                        this.$productImgWrapper    = domElem.productImgWrapper.elem;
                        this.$productBanner        = domElem.productBanner.elem;
                        this.$productDetail        = domElem.productDetail.elem;
                        this.$productImgGuide      = domElem.productImgGuide.elem;
                        this.$productImgsDetail    = domElem.productImgsDetail.elem;
                        this.$productImgsSpec      = domElem.productImgsSpec? domElem.productImgsSpec.elem : null;
                        this.$ptDetailSpec         = domElem.ptDetailSpec ? domElem.ptDetailSpec.elem : null;
                        this.$ptDetailPromotion    = domElem.ptDetailPromotion ? domElem.ptDetailPromotion.elem : null;
                        this.$selectList           = domElem.selectList ? domElem.selectList.elem:null;
                        // dialog元素
                        this.dialogIntance         = domElem.dialog;
                        this.$dialogHeader         = domElem.dialog.elem.find('.dialog-header');
                        this.$dialogMain           = domElem.dialog.elem.find('.dialog-main');
                        this.$dialogSpec           = domElem.dialogSpec.elem;
                        this.$dialogCancel         = domElem.dialogCancel.elem;
                        this.$dialogConfirm        = domElem.dialogConfirm.elem;
                        this.$bottomNav = $('.bottom-nav');
                        this.viewPortHeight = deviceHeight - navHeight;
                        // 规格
                        var specValue = domElem.dialogSpec.specInfo.elem.val();
                        if(specValue){
                            this.specInfo = JSON.parse(domElem.dialogSpec.specInfo.elem.val());
                            this.$specList = this.$dialogSpec.find('.spec-list');
                        }
                        var callAddress = scope["callAddress"];
                        if(callAddress){
                            this.dom.object.ptDetailDelivery.currentAddress = callAddress.addressStr;
                        }
                        $('input').each(function(index,item){
                            var $item = $(item);
                            var name = $item.attr('name');
                            if(name){
                                that.inputs[name] = $item;
                            }
                        });
                        this.productId = this.inputs['goods[product_id]'].val();
                    },
                    setStore:function(val){
                        var domElem = this.dom.elem;
                        this.dom.object.dialogSpec.store = val;
                        domElem.countSelect.setMax(val);
                        if(Number(val) === 0){
                            domElem.countSelect.setMin(0);
                            this.dom.object.countSelect.countNum = 0;
                        }else{
                            domElem.countSelect.setMin(1);
                            this.dom.object.countSelect.countNum = 1;
                        }

                    },
                    // 门店自提初始化
                    addrInit:function(){
                        var that = this;
                        var object = this.dom.object;
                        var dom_Elem = this.dom.elem;

                        (function getAddr(){
                            object.areaSelect.province = $.cookie("choice[provinceId]")||"";
                            object.areaSelect.city = $.cookie("choice[cityId]")||"";
                            object.areaSelect.area = $.cookie("choice[areaId]")||"";
                            object.areaSelect.shop = $.cookie("choice[shopId]")||"";
                            object.areaSelect.shopDistance = $.cookie("choice[shopAddr]")||"";
                            var shopN = $.cookie("choice[shopName]")||"";
                            that.shipping_type = $.cookie("choice[shipping_type]") || that.shipping_type;
                            if(!shopN){
                                object.ptDetailDelivery.shopName = '请选择门店';
                                dom_Elem.ptDetailDelivery.shopName.addClass('placeholder');
                                dom_Elem.ptDetailDelivery.selfTakeOffVal.addClass('hide');
                            }else{
                                object.ptDetailDelivery.shopName = shopN;
                                object.ptDetailDelivery.shopDistance = object.areaSelect.shopDistance;
                                dom_Elem.ptDetailDelivery.shopName.removeClass('placeholder');
                                dom_Elem.ptDetailDelivery.selfTakeOffVal.removeClass('hide');
                            }
                        })();

                        if(that.shipping_type=='self'){
                            that.setShippingType('pickup');
                        }
                        this.dom.elem.areaSelect.setProduct(this.inputs['goods[product_id]'].val());
                        this.dom.elem.areaSelect.callBack(function() {
                            $.cookie("choice[provinceId]", object.areaSelect.province);
                            $.cookie("choice[cityId]", object.areaSelect.city);
                            $.cookie("choice[areaId]", object.areaSelect.area);
                            $.cookie("choice[shopId]", object.areaSelect.shop);
                            $.cookie("choice[shopName]", object.areaSelect.shopN);
                            $.cookie("choice[shopAddr]", object.areaSelect.shopDistance);
                            object.ptDetailDelivery.shopName = object.areaSelect.shopN;
                            dom_Elem.ptDetailDelivery.shopName.removeClass('placeholder');
                            object.ptDetailDelivery.shopDistance = object.areaSelect.shopDistance;
                            dom_Elem.ptDetailDelivery.selfTakeOffVal.removeClass('hide');
                            if(typeof hash === 'string'){
                                hash = {
                                    id:hash,
                                    customShopId:object.areaSelect.shop
                                };
                            }else{
                                hash.customShopId = object.areaSelect.shop;
                            }
                            glob.init(hash);
                        });
                    },
                    // 选中规格重置
                    setProductSpecInfo: function(num){
                        if(!num){
                            if(productNum.productId == this.productId)
                                num = Number(productNum.count)||1;
                            else
                                num = 1;
                            this.dom.elem.countSelect.setCount(num);
                            // this.inputs['goods[num]'].val(num);
                            // this.dom.object.countSelect.countNum = num;
                        }
                        var $spec = this.$ptDetailSpec.find('.-col-content');
                        if(this.specInfo){
                            var array = [];
                            var length = this.specCurrent.dom.length;
                            for(var i=0; i<length;i++){
                                array.push($.trim(this.specCurrent.dom[i].text()));
                            }
                            array.push(num+"个");
                            array = array.join('/');
                            $spec.text(array);
                        }else{
                            $spec.text(num+"个");
                        }
                    },
                    // 商品图片详情初始化，包含事件绑定，滚动绑定
                    productImgWrapperInit:function(){
                        this.$productImgWrapper.height(this.viewPortHeight);
                        this.dom.elem.productBanner.flexslider.elem.flexslider({
                            animation: 'slide',
                            direction: 'horizontal',
                            directionNav: false,
                            slideshow:false,
                            pauseOnHover:true
                        });

                        this.$productDetailTitle.on('click',function(e){
                            var ele = this.dom.elem;
                            if(ele.productImgGuideDetail)
                                this.toggleProductImgDetail();
                            else if(ele.productImgGuideSpec){
                                this.$productImgsDetail.addClass('hide');
                                this.$productImgsSpec.removeClass('hide');
                                this.toggleProductImgDetail(function(){
                                    this.productImgScroll.refresh();
                                }.bind(this));
                            }
                        }.bind(this));
                    },
                    // 事件绑定
                    eventBinding:function(){
                        var that = this;
                        var dom_Elem = this.dom.elem;
                        if(this.$ptDetailSpec){
                            this.$ptDetailSpec.on('click',function(){
                                var dialog = that.dialogIntance;
                                dialog.open(function(){
                                    var contents = that.$dialogMain;
                                    contents.addClass('hide');
                                    contents.each(function(index,item){
                                        var $item = $(item);
                                        if($item.hasClass('dialog-product-spec')){
                                            $item.removeClass('hide');
                                            that.$dialogHeader.find('.dialog-product-title').text($item.attr('attr-title'));
                                        }
                                    });

                                });
                            });
                        }
                        if(this.$ptDetailPromotion){
                            this.$ptDetailPromotion.find("li").on('click',function(e){
                                var $this = $(this);
                                var type = $(this).attr('data-type');
                                var dialog = that.dialogIntance;
                                dialog.open(function(){
                                    var contents = that.$dialogMain;
                                    contents.addClass('hide');
                                    contents.each(function(index,item){
                                        var $item = $(item);
                                        if($item.attr('data-type') == type){
                                            $item.removeClass('hide');
                                            that.$dialogHeader.find('.dialog-product-title').text($item.attr('attr-title'));
                                        }
                                    });
                                });
                            });
                        }
                        // 商品详情
                        if(this.dom.elem.productImgGuide.productImgGuideDetail){
                            this.dom.elem.productImgGuide.productImgGuideDetail.on('click',function(){
                                that.$productImgsDetail.removeClass('hide');
                                if(that.$productImgsSpec)
                                    that.$productImgsSpec.addClass('hide');
                                if(!that.flag_imgView){
                                    that.toggleProductImgDetail(function(){
                                        that.productImgScroll.refresh();
                                    });
                                }else{
                                    that.productImgScroll.refresh();
                                }
                            });
                        }
                        // 商品规格
                        if(this.dom.elem.productImgGuide.productImgGuideSpec){
                            this.dom.elem.productImgGuide.productImgGuideSpec.on('click',function(){
                                // var productBannerHeight = that.$productBanner.height();
                                // var productImgsDetailHeight = that.dom.elem.productImgsDetail.elem.height();
                                // var offset = -1 * (productBannerHeight+productImgsDetailHeight);
                                if(that.$productImgsDetail)
                                    that.$productImgsDetail.addClass('hide');
                                that.$productImgsSpec.removeClass('hide');
                                if(!that.flag_imgView){
                                    that.toggleProductImgDetail(function(){
                                        that.productImgScroll.refresh();
                                    });
                                }else{
                                    that.productImgScroll.refresh();
                                }
                            });
                        }
                        // 商品规格事件
                        this.$dialogSpec.find('.spec-item').on('click',function(e){
                            var $this = $(this);
                            if($this.hasClass('disabled')) return;
                            var parent = $this.closest('.spec-list');
                            $this.addClass('act').siblings().removeClass('act');
                            var key = $this.attr('data-item-key');
                            var img = $this.attr('data-image');
                            var index = that.$specList.index(parent);
                            that.specCurrent.value[index] = key;
                            that.specCurrent.dom[index] = $this;
                            if(img){
                                that.dom.elem.dialog.dialogImg.elem.attr('src',img);
                            }
                            var name = that.specCurrent.value.join('-');
                            if(that.specInfo[name]){
                                that.dom.object.dialog.primaryPrice = "￥" + that.specInfo[name].price;
                            }
                            that.checkStore();
                        });
                        // 到货通知
                        if(this.dom.elem.ptEmptyInform){
                            this.dom.elem.ptEmptyInform.on('click',function(){
                                that.notify();
                            });
                        }

                        this.$dialogCancel.on('click',function(){
                            that.dialogIntance.close();
                        });
                        // 规格确认
                        this.$dialogConfirm.on('click',function(){
                            var num = that.dom.object.countSelect.countNum;
                            if(num<1){
                                that.dom.elem.popup.show('请选择数量',500);
                                return;
                            }
                            productNum = {
                                productId:that.productId,
                                count:num
                            };
                            that.setProductSpecInfo(num);

                            if(that.specInfo){
                                var productId;
                                var name = that.specCurrent.value.join('-');
                                if(that.specInfo[name]){
                                    productId = that.specInfo[name].product_id;
                                    that.dialogIntance.close(function(){
                                        location.hash = "#/product/"+productId;
                                    });
                                }
                            }else{
                                that.dialogIntance.close();
                            }
                        });
                        var ptDetailDelivery = that.dom.elem.ptDetailDelivery;
                        // 配送信息
                        if(ptDetailDelivery){
                            ptDetailDelivery.find('.btn-mode').on('click',function(e){
                                var $this = $(this);
                                var tab = $this.attr('data-tab');
                                that.setShippingType(tab);
                                scope.noScrollTop = true;
                                if(typeof hash === 'string'){
                                    glob.init(hash);
                                }else{
                                    glob.init(hash.id);
                                }

                            });
                            ptDetailDelivery.currentAddress.callback(function(isChangeWX, data, d) {
                                if (isChangeWX) {
                                    if (d.success) {
                                        var addStr = data.provinceName + data.cityName;
                                        if (data.countryName) {
                                            addStr += data.countryName;
                                        };
                                        addStr += data.detailInfo;
                                        var addId = d.data[0]["addr_id"];
                                        object.ptDetailDelivery.currentAddress = addStr;
                                        // object.ckAddress.address = addStr;
                                        // object.ckAddress.name = data.userName;
                                        // object.ckAddress.phone = data.telNumber;
                                        // object.ckAddress.ipt_addr_id = addId;
                                        // object.ckAddress.ipt_addr_info = addStr;
                                        // this.inputs['address'].value = JSON.stringify({
                                        //     addr_id:addId,
                                        //     // area:addr.area // todo
                                        // });
                                        $.cookie("choice[addr_id]", addId);
                                        $.cookie("choice[addr_info]", addStr);
                                    };
                                } else {
                                    scope["chooseAddr"] = true;
                                    scope["addrCallBackURL"] = location.hash;
                                    location.hash = "#/member/shopping/address";
                                }
                            });
                        }
                        // 收藏
                        var isFavorite = true;
                        dom_Elem.favorite.on('click',function(){
                            var $this = $(this);
                            var goodId = $this.data('gid');
                            if(!goodId) return;
                            that.dom.elem.favorite.toggleFavorite(goodId,isFavorite,function(re){
                                var msg = '';
                                if(re.failed){
                                    that.dom.elem.popup.show(re.failed,1000);
                                }
                                if(re.success){
                                    msg = isFavorite ? '收藏成功':'取消收藏成功';
                                    if(isFavorite){
                                        $this.removeClass('remove').addClass('act');
                                    }else{
                                        if($this.hasClass('act')){
                                            $this.removeClass('act').addClass('remove');
                                        }else{
                                            $this.removeClass('act');
                                        }
                                    }
                                    that.dom.elem.popup.show(msg,1000);
                                    isFavorite = !isFavorite;
                                }
                            });
                        });
                        // 加入购物车
                        if(dom_Elem.ptAddCart){
                            this.dom.elem.ptAddCart.on('click',function(){
                                that.addCart();
                            });
                        }
                        // 立即购买
                        if(dom_Elem.ptFastBuy){
                            this.dom.elem.ptFastBuy.on('click',function(){
                                that.addCart(true,function(){
                                    location.hash = "#/cart/checkout/true";
                                });
                            });
                        }

                        if (dom_Elem.ptDetailDelivery.areaShop) {
                            dom_Elem.ptDetailDelivery.areaShop.on('click', function(e) {
                                dom_Elem.areaSelect.show();
                            });
                        }
                    },
                    // express,pickup
                    setShippingType:function(type){
                        var that = this;
                        var ptDetailDelivery = that.dom.elem.ptDetailDelivery;
                        var btn = ptDetailDelivery.find('.btn-mode[data-tab='+type+']');

                        btn.addClass('on').siblings().removeClass('on');
                        var $unit = ptDetailDelivery[type].elem;
                        ptDetailDelivery[type].elem.siblings().not('.delivery-mode').addClass('hide');
                        if(type === 'pickup'){
                            that.shipping_type = 'self';
                            // $unit.removeClass('hide');
                        }else{
                            // if($.trim(that.dom.object.ptDetailDelivery.currentAddress)){
                            //     $unit.removeClass('hide');
                            // }
                            // $unit.removeClass('hide');
                            that.shipping_type = 'delivery';
                        }
                        $unit.removeClass('hide');
                        $.cookie("choice[shipping_type]",that.shipping_type);
                    },
                    // 商品图片详情切换
                    toggleProductImgDetail : function(callback){
                        this.productImgScroll = this.productImgScroll || new IScroll(this.$productImgWrapper[0],{
                            mousewheel:true,
                            tap:true,
                            click:true
                        });
                        if(!this.flag_imgView){
                            var notice = this.$bottomNav.find('.arrival-notice-wrapper');
                            // 开启
                            this.$body.scrollTop(0);
                            this.$productImgGuide.addClass('fixed');
                            this.productImgScroll.enable();
                            this.$productDetailTitle.addClass('act');
                            this.$selectList.addClass('hide');
                            this.$productDetailTitle.on('touchmove',function(e){
                                e.preventDefault();
                                e.stopPropagation();
                            });
                            // 改transform
                            this.$productDetail.css('marginTop',this.viewPortHeight - this.$productDetailTitle.find('.product-title').height());

                            if(notice.hasClass('hide'))
                                this.$bottomNav.css('bottom',(this.$bottomNav.height()+2)*-1);
                            else
                                this.$bottomNav.css('bottom',(this.$bottomNav.height()+notice.height()+2)*-1);
                        }else{
                            // 关闭
                            this.$productDetailTitle.off('touchmove');
                            this.$productImgGuide.removeClass('fixed');
                            this.$productDetailTitle.removeClass('act');
                            this.$selectList.removeClass('hide');
                            this.$productDetail.removeAttr('style');
                            this.productImgScroll.scrollTo(0,0);
                            setTimeout(function(){
                                this.$bottomNav.css('bottom',0);
                                this.productImgScroll.disable();
                            }.bind(this),500);
                        }
                        // 设置状态
                        this.flag_imgView = !this.flag_imgView;
                        if(typeof callback === 'function'){
                            setTimeout(function(){
                                callback(this.flag_imgView);
                            }.bind(this),400);
                        }
                    },
                    // 当前规格初始化
                    specStoreInit: function(){
                        var that = this;
                        if(this.specInfo){
                            $.each(this.$specList,function(index,item){
                                var $item = $(item);
                                var unit = $item.find('.spec-item.act');
                                that.specCurrent.value.push(unit.attr('data-item-key'));
                                that.specCurrent.dom.push(unit);
                                that.specSelect.value.push(unit.attr('data-item-key'));
                                that.specSelect.dom.push(unit);
                            });
                        }
                        that.checkStore();
                    },
                    // 规格库存
                    checkStore: function(){
                        var that = this;
                        if(this.specInfo){
                            var total = this.specInfo;
                            var key = this.specCurrent.value.join('-');
                            if(total[key] && Number(total[key].store) === 0){
                                this.setStore(0);
                                this.$dialogConfirm.addClass('disabled').text('暂无库存');
                            }else{
                                this.setStore(Number(this.specInfo[key].store));
                                // this.dom.object.dialogSpec.store = Number(this.specInfo[key].store);
                                this.$dialogConfirm.removeClass('disabled').text('确认选择');
                            }
                        }else{
                            if(this.dom.object.dialogSpec.store == 0){
                                this.$dialogConfirm.addClass('disabled').text('暂无库存');
                            }else{
                                this.$dialogConfirm.removeClass('disabled').text('确认选择');
                            }
                        }
                    },
                    // 加入购物车
                    addCart:function(isFastBuy,callback){
                        var that = this;
                        if(typeof isFastBuy === 'function'){
                            callback = isFastBuy;
                            isFastBuy = false;
                        }
                        var data = {
                            'is_selected':1,
                            'goods[goods_id]':that.inputs['goods[goods_id]'].val(),
                            'goods[product_id]':that.inputs['goods[product_id]'].val(),
                            'min':that.inputs['min'].val(),
                            'max':that.inputs['max'].val(),
                            'min_cart':'true',
                            'goods[num]':that.inputs['goods[num]'].val(),
                            'btype':isFastBuy ? 'is_fastbuy':""
                        };
                        if(that.shipping_type=='self'){
                            $.extend(data,{
                                'province': that.inputs['province'].val(),
                                'city': that.inputs['city'].val(),
                                'area':that.inputs['area'].val(),
                                'areaDateShopId':that.inputs['shop'].val()
                            });
                        }
                        toolObject.ajaxWrap({
                            url:globleURL.addCart,
                            data:data,
                            type:"POST"
                        },function(re){
                            re = JSON.parse(re);
                            if(re.success){
                                that.dom.elem.popup.show(re.success,1000,function(){
                                    productNum = {};
                                    if(re.msgid == 40301) {
                                        location.hash = "#/passport";
                                    }else {
                                        if(typeof callback === 'function')
                                            callback();
                                    }
                                });
                            }
                            if(re.error){
                                that.dom.elem.popup.show(re.error,1000);
                            }
                        });
                    },
                    // 到货通知
                    notify: function(){
                        var that = this;
                        var cellphone = this.inputs['cellphone'].val();
                        if(!$.trim(cellphone)) return;
                        toolObject.ajaxWrap({
                            url:globleURL.toNotify,
                            data:{
                                'goods_id':that.inputs['goods[goods_id]'].val(),
                                'product_id':that.inputs['goods[product_id]'].val(),
                                'cellphone':cellphone
                            },
                            type:"POST"
                        },function(re){
                            re = JSON.parse(re);
                            if(re.error){
                                that.dom.elem.popup.show(re.error,1000);
                            }
                            if(re.true){
                                that.dom.elem.popup.show(re.true,1000,function(){
                                    that.inputs['cellphone'].val('');
                                });
                            }
                        });
                    },
                    addFootPrint: function(){
                        var dom_Elem = this.dom.elem;
                        var product = {};
                        var data = localStorage.getItem('footprint');
                        var copy = [];
                        var month;
                        product.id = this.inputs['goods[goods_id]'].val();
                        product.url = location.href;
                        product.title = $.trim(dom_Elem.productDetailTitle.elem.find('.product-title').text());
                        product.img = dom_Elem.dialog.dialogImg.elem.prop('src');
                        product.date = new Date();
                        curMonth = product.date.getMonth();
                        copy.push(product);
                        if(data){
                            data = JSON.parse(data);
                            $.each(data,function(index,item){
                                var date = new Date(item.date);
                                var month = date.getMonth();
                                if( month+1 >= curMonth && product.id != item.id){
                                    copy.push(item);
                                }
                            });
                        }
                        localStorage.setItem('footprint',JSON.stringify(copy));
                    }
                };
                Product.init(elem,object,setRule);

                // console.log('product:'+hash);
            });
        }
    };
});