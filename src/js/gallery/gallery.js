define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var oEcstore = require('oEcstore');
    var filter;
    var catyId;

    var isHasNextPage = false;
    var page = 1;
    var isloading = false;

    var orderFilter = "";


    var getGoodItem = function(data) {
        var name ;
        if (data.prepare) {
            name = "预售" + data.name;
        } else {
            name = data.name;
        }
        return [
            '<li class="goods-brief-item">',
                  '<a href="#/product/' + data.products.product_id + '">',
                    '<div class="goods-brief-img">',
                        '<img src="' + data.image_src + '" alt=""></div>',
                        '<div class="goods-brief-info">',
                          '<p class="goods-brief-title">' + name + '</p>',
                          '<p class="goods-brief-price">￥' + parseFloat(data.products.price).toFixed(2) + '</p>',
                            '<p class="goods-brief-note">',
                                '<span class="goods-brief-appraise">好评率<span class="val">' + data.estimate_good + '%</span></span>',
                                '<span class="goods-brief-count">已有<span class="val">' + data.buy_count + '</span>人购买</span>',
                            '</p>',
                        '</div>',
                   ' </a>',
                '</li>'
        ].join("");
    };
    module.exports = {
        init: function(id) {
            domObject.doit('/gallery/gallery', id, function(elem, object, setRule) {
                if( Object.prototype.toString.call(id).slice(8,-1) === "Object" ){
                    id = id.id;
                }
                // 下拉加载
                $(window).unbind("scroll");
                $(window).scroll(function(e) {
                    var scrollTop = $(document.body).scrollTop();
                    var listHeight = $(".goods-brief-list").height();
                    var view = $(window).height() - $(".layout-search-title").height() - $(".layout-nav").height();
                    if (listHeight > view) {
                        if (listHeight - view - scrollTop <= 0) {
                            if (( parseInt(object.gallery.pagetotal) > parseInt(object.gallery.pagecurrent)) && (isloading == false)) {
                                isloading = true;
                                setGoods(orderFilter, function() {
                                    isloading = false;
                                }, parseInt(object.gallery.pagecurrent) + 1);
                            };
                        };
                    };
                });

                $($(".gallery-filter-menu")[0]).addClass("active");
                $($(".gallery-filter-menu-list")[0]).addClass("active");

                // 筛选分类切换
                $(".gallery-filter-menu").unbind("click");
                $(".gallery-filter-menu").on('click', function(e) {
                    $(".gallery-filter-menu.active").removeClass("active");
                    $(".gallery-filter-menu-list.active").removeClass("active");
                    $(this).addClass("active");
                    $(".gallery-filter-menu-list[data-id=" + $(this).data("id") + "]").addClass("active");
                });

                // 二级分类勾选
                $(".gallery-filter-menu-item").unbind("click");
                $(".gallery-filter-menu-item").on("click", function(e) {
                    $(this).toggleClass("active");
                    $(this).parent().find(".gallery-filter-menu-item").not(this).removeClass("active");
                });

                // 重置按钮
                elem.galleryFilterWrapper.reset.on("click", function(e) {
                    object.galleryFilterWrapper.shopPickUp = false;
                    object.galleryFilterWrapper.shopStore = false;
                    $(".gallery-filter-menu-item").removeClass("active");
                    filter = undefined;
                    catyId = undefined;
                });

                // 确认按钮
                elem.galleryFilterWrapper.confirm.on("click", function(e) {
                    filter = {
                        is_store: object.galleryFilterWrapper.shopStore,
                        custom_store: object.galleryFilterWrapper.shopPickUp
                    };
                    // brand_id
                    filter["brand_id"] = $(".gallery-filter-menu-list[data-id=2] .gallery-filter-menu-item.active").data("catid");
                    // price
                    filter["price"] = $(".gallery-filter-menu-list[data-id=3] .gallery-filter-menu-item.active").data("catid");
                    // id

                    catyId = $(".gallery-filter-menu-list[data-id=1] .gallery-filter-menu-item.active").data("catid");
                    orderFilter = "";
                    setGoods(orderFilter);
                });

                var setGoods = function(orderBy, callBack, pageNum) {
                    var data = {orderBy: orderBy};
                    if (typeof(catyId) != "undefined") {
                        data["cat_id"] = catyId;
                    } else {
                        data["cat_id"] = id;
                    }

                    if (filter) {
                        $.extend(data, filter);
                    };

                    if (typeof(pageNum) != "undefined") {
                        data["page"] = pageNum;
                    };

                    toolObject.getGoods(data, function(data) {
                        if (data.data && data.data.goods_list) {

                            if (data.data.page_info) {

                                object.gallery.pagecurrent = data.data.page_info.page;
                                object.gallery.pagetotal = data.data.page_info.pagetotal;
                                object.gallery.total = data.data.page_info.total;
                            };

                            var goodsList = data.data.goods_list;
                            var goodsStr = "";
                            for (var i = 0; i < goodsList.length; i++) {
                                goodsStr += getGoodItem(goodsList[i]);
                            };
                            if (object.gallery.pagecurrent == 1) {
                                oEcstore.html($(".goods-brief-list"), goodsStr);
                            } else {
                                oEcstore.append($(".goods-brief-list"), goodsStr);
                            }
                            elem.gallery.galleryFilterWrapper.addClass("hide");
                            callBack();
                        };
                    }, function(err) {

                    });
                }

                // 切换排序
                elem.header.titleCog.on('click', function(e) {
                    if ($(this).find("i").hasClass("iconfont-list-ul")) {
                        $(this).find("i").removeClass("iconfont-list-ul").addClass("iconfont-list-grid");
                        $(".goods-brief-list").removeClass("column-2").addClass("column-1");
                    } else {
                        $(this).find("i").addClass("iconfont-list-ul").removeClass("iconfont-list-grid");
                        $(".goods-brief-list").removeClass("column-1").addClass("column-2");
                    }
                });

                // 综合

                elem.gallery.galleryTotal.on('click', function(e) {
                    if (!$(this).hasClass("act")) {
                        $(".btn-group-justified li.act").removeClass("act");
                        $(".sort-triangles-wrapper").removeClass("asc").removeClass("desc");
                        elem.gallery.galleryFilterWrapper.addClass("hide");
                        $(this).addClass("act");
                        orderFilter = "";
                        setGoods(orderFilter);
                    };
                });

                // 价格
                elem.gallery.galleryPrice.on('click', function(e) {
                    var isASC = 'asc';
                    var DESC = 'desc';
                    if ($(this).find(".sort-triangles-wrapper").hasClass("desc")) {
                        isASC = 'asc';
                        DESC = 'desc';
                    } else if ($(this).find(".sort-triangles-wrapper").hasClass("asc")) {
                        isASC = 'desc';
                        DESC = 'asc';
                    };
                    $(".btn-group-justified li.act").removeClass("act");
                    $(".sort-triangles-wrapper").removeClass("asc").removeClass("desc");
                    elem.gallery.galleryFilterWrapper.addClass("hide");
                    $(this).addClass("act");

                    $(this).find(".sort-triangles-wrapper").removeClass(DESC).addClass(isASC);
                    orderFilter = "price " + isASC;
                    setGoods(orderFilter);
                });

                // 销量
                elem.gallery.gallerySales.on('click', function(e) {
                    var isASC = 'asc';
                    var DESC = 'desc';
                    if ($(this).find(".sort-triangles-wrapper").hasClass("asc")) {
                        isASC = 'asc';
                        DESC = 'desc';
                    } else if ($(this).find(".sort-triangles-wrapper").hasClass("desc")) {
                        isASC = 'desc';
                        DESC = 'asc';
                    };
                    $(".btn-group-justified li.act").removeClass("act");
                    $(".sort-triangles-wrapper").removeClass("asc").removeClass("desc");
                    elem.gallery.galleryFilterWrapper.addClass("hide");
                    $(this).addClass("act");
                    $(this).find(".sort-triangles-wrapper").removeClass(isASC).addClass(DESC);
                    orderFilter = "buy_count " + DESC;
                    setGoods(orderFilter);
                });

                // 筛选
                elem.gallery.galleryFilter.on('click', function(e) {
                    $(".btn-group-justified li.act").removeClass("act");
                    $(".sort-triangles-wrapper").removeClass("asc").removeClass("desc");
                    $(this).addClass("act");
                    elem.gallery.galleryFilterWrapper.toggleClass("hide");
                });
            });
        }
    };
});