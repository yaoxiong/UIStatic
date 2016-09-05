define('domObject', ['jquery', 'oEcstore', 'routersConfig', 'baseObject', 'components', 'scope'], function(require, exports, module) {

    var $ = require('jquery');

    var oEcstore = require('oEcstore');

    var baseObject = require('baseObject');

    var routersConfig = require('routersConfig');

    var scope = require('scope');

    // 初始化每个页面，避免由于跨页带来的不必要的影响
    function reset(){
        var $body = $(document.body);
        if(!(scope.noScrollTop && scope.noScrollTop === true)){
            // 跳转页面顶部
            $body.scrollTop(0);
        }
        scope.noScrollTop = false;

        // 取消上个页面的绑定事件
        $body.off('click');
        // 清空之前页面的定时器
        $.each(scope.timeId,function(index,item){
            clearTimeout(item);
        });
        scope.timeId = [];
    }
    module.exports = {
        remove: function(elem){
            oEcstore.remove(elem);
        },
        html: function(elem, html) {
            oEcstore.html(elem, html);
        },
        getObject: function(isCache,key,hash,callBack) {
            // if(typeof hash == "function") {
            //     callBack = hash;
            //     hash = null;
            // }
            var url = routersConfig.setUrl(key,hash,isCache);
            if(url){
                require.async(url, function(data){
                    try{
                        data = JSON.parse(data);
                        if (data.msgid === 40302) {
                            scope["backHome"] = -2;
                            location.href = "#/passport";
                        }
                        if (data.msgid === 302) {
                            location.href = "#/member";
                        }
                        if (data.msgid === 40001) {
                            scope['pageError'] = data.error;
                            history.back();
                        };
                        if(data.error){
                            if(typeof popup === 'function'){
                                popup(data.error,1000,function(){
                                    if(data.data[0].url)
                                        location.href = data.data[0].url;
                                });
                            }else{
                                alert(data.error);
                                if(data.data[0].url)
                                    location.href = data.data[0].url;
                            }
                        }
                    }catch(e){
                        baseObject.setPage(key, data);
                        callBack();
                    }
                }.bind(this));
            }
        },
        doit : function(isCache, key, hash, callBack) {
            // reset();
            if(arguments.length === 3){
                if(typeof isCache !== 'boolean'){
                    callBack = hash;
                    hash = key;
                    key = isCache;
                    isCache = false;
                }else{
                    callBack = hash;
                    hash = null;
                }
            }else if(arguments.length === 2){
                callBack = key;
                key = isCache;
                hash = null;
                isCache = false;
            }
            // if(typeof hash == "function"){
            //     callBack = hash;
            //     hash = void 0;
            // }
            scope.currentRender =  callBack;
            this.getObject(isCache,key,hash,function() {
                var dataObject = oEcstore.getData($("#page"));
                var object = dataObject.object;
                var elem = dataObject.elem;
                if (scope['pageError']) {
                    if (elem.popup) {
                        elem.popup.show(scope['pageError']);
                        scope['pageError'] = '';
                    };
                };
                // try{
                    callBack(elem, object, oEcstore.setRule);
                // }catch(e){}
            });
        }

    };
});