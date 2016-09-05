define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    function filterOrder(elem, object, status) {
        for (var i = 0; i < object.commentList.length; i++) {
            var comment = object.commentList[i];
            var commentEle = elem.commentList[i];
            if (status == "all") {
                commentEle.show();
            } else {
                if (comment.__estimateType__ === status) {
                    commentEle.show();
                } else if (comment.__estimateIsImg__ === "Y" && status === "isImg") {
                    commentEle.show();
                } else {
                    commentEle.hide();
                }
            }

        };
    }

    module.exports = {
        init: function(id) {
            domObject.doit('/comment/good', id,  function(elem, object, setRule) {
                elem.commentGroup.all.on('click', function(e) {
                    elem.commentGroup.attr("data-act", 1);
                    filterOrder(elem, object, "all");
                });
                elem.commentGroup.estimateGood.on('click', function(e) {
                    elem.commentGroup.attr("data-act", 2);
                    filterOrder(elem, object, "estimate_good");
                });
                elem.commentGroup.estimateMiddle.on('click', function(e) {
                    elem.commentGroup.attr("data-act", 3);
                    filterOrder(elem, object, "estimate_middle");
                });
                elem.commentGroup.estimateDad.on('click', function(e) {
                    elem.commentGroup.attr("data-act", 4);
                    filterOrder(elem, object, "estimate_bad");
                });
                elem.commentGroup.estimateImg.on('click', function(e) {
                    elem.commentGroup.attr("data-act", 5);
                    filterOrder(elem, object, "isImg");
                });
                elem.commentGood.goodTips.find(".comment-good-tips-item").on('click', function(e){
                   $(".comment-good-tips-item.active").removeClass("active");
                   $(this).addClass("active");
                });
            });
        }
    };
});