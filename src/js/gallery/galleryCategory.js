define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function() {
            domObject.doit('/gallery/category', function(elem, object, setRule) {
                elem.category.elem.height($(window).height() - $(".top-nav").height() - $(".bottom-nav").height());
                elem.category.find(".category-content-first-item").on('click', function(e) {
                    if ($(this).data("isChild") === "false") {
                        location.href = '#/gallery/gallery/' + $(this).data("id");
                    } else {
                        $(".category-content-first-item.active").removeClass("active");
                        $(".category-content-second-item:not(.hide)").addClass("hide");
                        $(this).addClass("active");
                        $(".category-content-second-item[data-id=" + $(this).data("id") + "]").removeClass("hide");
                    }
                });

                elem.category.find(".category-content-second-item-item").on('click', function(e) {

                    location.href = '#/gallery/gallery/' + $(this).data("id");

                });

            });
        }
    };
});