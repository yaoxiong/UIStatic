define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/branch/detail', id, function(elem, object, setRule) {

                elem.shopDetail.shopImages.on('click', function(e) {
                    if (localStorage.getItem("shopAlbum") === "true") {
                        elem.shopAlbum.albumTip.hide();
                    };
                    elem.shopAlbum.show();

                    elem.shopAlbum.flexslider.elem.flexslider({
                        slideshow: false,
                        animation: 'slide',
                        directionNav: false,
                        direction: 'horizontal',
                        controlNav: false,
                        // keyboardNav: false,
                        // animationLoop: false,
                        after: function(data) {
                            object.shopAlbum.pageCurrent = data.currentSlide + 1;
                        }
                    });
                });

                elem.shopAlbum.close.on('click', function(e) {
                    elem.shopAlbum.hide();
                });

                elem.shopAlbum.albumTip.on('click', function(e) {
                    localStorage.setItem("shopAlbum", true);
                    elem.shopAlbum.albumTip.hide();
                });
            });
        }
    };
});