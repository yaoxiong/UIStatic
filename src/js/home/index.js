define(function(require, exports, module) {

    var $ = jQuery = require('jquery');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var flexslider = require('flexslider');

    require("scrollUp");

    module.exports = {
        init: function() {
            domObject.doit('/home', function(elem, object, setRule) {
                $(".flexslider").flexslider({
                    animation: 'slide',
                    direction: 'horizontal',
                    directionNav: false
                });
                elem.widetShop.on('click', function(e) {
                    location.href = "#/branch/branch";
                });

                var setNullShop = function() {
                    object.widetShop.titleName = "您附近暂无门店";
                    object.widetShop.image = {
                        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAYAAABUx/9/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjhFRjI5NEMyOUZBMTFFNjlDM0NBNzhDNzUwREI5QTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjhFRjI5NEQyOUZBMTFFNjlDM0NBNzhDNzUwREI5QTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCOEVGMjk0QTI5RkExMUU2OUMzQ0E3OEM3NTBEQjlBNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOEVGMjk0QjI5RkExMUU2OUMzQ0E3OEM3NTBEQjlBNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ptw7hsUAABYuSURBVHja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',
                        alt: ''
                    };
                    object.widetShop.localName = '';
                    object.widetShop.addr = '';
                    object.widetShop.distance = '';
                };
                object.widetShop.titleName = "定位中";
                toolObject.getLocation(function(data){
                    if (data.success) {
                        if (data.data.shops.length > 0) {
                            var nearbyShop = data.data.shops[0];
                            object.widetShop.image = {
                                src: nearbyShop.image,
                                alt: nearbyShop.local_name
                            };
                            object.widetShop.titleName = "离您最近的门店";
                            object.widetShop.localName = nearbyShop.local_name;
                            object.widetShop.addr = nearbyShop.addr;
                            object.widetShop.distance = nearbyShop.distance;
                        } else {
                            setNullShop();
                        }
                    } else {
                        setNullShop();
                    }
                }, function(err) {
                    setNullShop();
                });
            });
        }
    };
});