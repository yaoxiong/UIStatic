define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/member/discuss', id, function(elem, object, setRule) {
                // 关键词选择
                $(".comment-item-labels .label-default").on('click', function(e){
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                    } else {
                        $(this).addClass("active");
                    }
                });

                $(".upload-imgs-item2").find(".upload-desc").hide();
                // $(".upload-imgs-item2").find(".upload-img-preview").hide();
                $(".upload-imgs-item3").find(".upload-desc").hide();
                // $(".upload-imgs-item3").find(".upload-img-preview").hide();

                elem.comment.submit.on('click', function(e) {
                    var data = {
                        "order_id": id,
                        "comment":{},
                        "file": {},
                        "goods_grade": {},
                        "goods_id": {},
                        "keyword":{},
                        "product_id":[]
                    };
                    if (object.shop) {
                        data["local_id"] = object.shop.localId;
                        data["transport_grade"] = object.shop.shopScores1.value;
                        data["environment_grade"] = object.shop.shopScores2.value;
                        data["service_grade"] = object.shop.shopScores3.value;
                        data["shop_comments"] = object.shop.shopComments;
                    };

                    var index = 0;
                    var isHaveShop = false;
                    for (var i = 0; i < object.commentList.length; i++) {
                        var comment = object.commentList[i];
                        var commentEle = elem.commentList[i];
                        if (comment.localId) {
                            isHaveShop = true;
                            index = index - 1;
                        } else{
                            if (isHaveShop) {
                                index += 1;
                            } else {
                                index = i;
                            }
                        };
                        if (!comment.localId) {
                            data["comment"][comment.productId] = comment.comment;
                            if (object["uploadImgs" + index + "1"].imageFileId) {
                                if (!data["file"][comment.productId]) {
                                    data["file"][comment.productId] = [];
                                };
                                data["file"][comment.productId][data["file"][comment.productId].length] = object["uploadImgs" + index + "1"].imageFileId;
                            };
                            if (object["uploadImgs" + index + "2"].imageFileId) {
                                if (!data["file"][comment.productId]) {
                                    data["file"][comment.productId] = [];
                                };
                                data["file"][comment.productId][data["file"][comment.productId].length] = object["uploadImgs" + index + "2"].imageFileId;
                            };
                            if (object["uploadImgs" + index + "3"].imageFileId) {
                                if (!data["file"][comment.productId]) {
                                    data["file"][comment.productId] = [];
                                };
                                data["file"][comment.productId][data["file"][comment.productId].length] = object["uploadImgs" + index + "3"].imageFileId;
                            };
                            data["goods_grade"][comment.productId] = comment["scores" + index].value;
                            data["goods_id"][comment.productId] = comment.goodId;
                            data["keyword"][comment.productId] = [];
                            if (commentEle.find(".label-default").length > 0) {
                                for (var j = 0; j < commentEle.find(".label-default.active").length; j++) {
                                    var label = commentEle.find(".label-default.active")[j];
                                    data["keyword"][comment.productId][data["keyword"][comment.productId].length] = $(label).data("id");
                                };
                            };
                            if (!data["product_id"]) {
                                data["product_id"] = [];
                            };
                            data["product_id"][data["product_id"].length] = comment.productId;

                        };
                    };
                    toolObject.ajaxWrap({
                        url: globleURL.submitComments,
                        type: "post",
                        data: data

                    }, function(data){
                        data = JSON.parse(data);
                        if (data.success) {
                            location.href = "#/member/orders";
                        } else {
                            elem.popup.show(data.failed);
                        }
                    }, function(err){
                        elem.popup.show(err);
                    });
                });
            });
        }
    };
});