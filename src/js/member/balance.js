define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(hash) {
            switch (hash){
                case 'detail':
                    domObject.doit('/member/balance/detail', function(elem, object, setRule) { 
                    });
                break;
                default :
                    domObject.doit('/member/balance', function(elem, object, setRule) {
                    });
            }
        }
    };
});