define('domObject', ['jquery', 'oEcstore', 'routersConfig', 'baseObject', 'components', 'scope'], function(require, exports, module) {

    var $ = require('jquery');

    var oEcstore = require('oEcstore');

    var baseObject = require('baseObject');

    var routersConfig = require('routersConfig');

    var scope = require('scope');

    module.exports = {
        remove: function(elem){
            oEcstore.remove(elem);
        },
        getObject: function(key, callBack) {

            if (routersConfig[key]) {

                require.async(routersConfig[key], function(data){
                    baseObject.setPage(key, data);
                    callBack();
                }.bind(this));
            }
        },
        doit : function(key, callBack) {
            scope.currentRender =  callBack;
            this.getObject(key,  function() {

                var dataObject = oEcstore.getData($("#page"));
                console.log(dataObject);
                var object = dataObject.object;
                var elem = dataObject.elem;
                try{
                    callBack(elem, object, oEcstore.setRule);

                }catch(e){}

            });
        }

    };
});