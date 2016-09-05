define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function() {
            domObject.doit('/member', function(elem, object, setRule) {

                // elem.member.signIn.on('click', function(e) {
                //     toolObject.ajaxWrap({
                //         url: globleURL.memberSignIn,
                //         data: {},
                //         type: 'get',
                //     }, function(data){
                //         object.member.signIn = '已签到';
                //     }, function(jqXHR){

                //     });
                // });

                if (elem.member.login) {
                    elem.member.login.on('click', function(e) {
                       location.href = "#/passport";
                    });
                    elem.member.register.on('click', function(e) {
                       location.href = "#/passport/register";
                    });
                };
            });
        }
    };
});