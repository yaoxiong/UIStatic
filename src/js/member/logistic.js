define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/member/orders/logistic',id, function(elem, object, setRule) {
                console.log(id);
            });
        }
    };
});