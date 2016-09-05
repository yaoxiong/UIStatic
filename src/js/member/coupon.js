define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(action,id) {
            switch (action){
                case 'valid' : 
                    domObject.doit('/coupon/valid', function(elem, object, setRule) {
                        console.log('valid');
                    });break;
                case 'used' : 
                    domObject.doit('/coupon/used', function(elem, object, setRule) {
                        console.log('used');
                    });break;
                case 'expire' :
                    domObject.doit('/coupon/expire', function(elem, object, setRule) {
                        console.log('expire');
                    });break;
                case 'detail' :
                    domObject.doit('/coupon/detail',id,function(elem, object, setRule) {
                        console.log('detail'+id);
                    });break;
            }
        }
    };
});