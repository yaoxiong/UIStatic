define('components', [], function(require, exports, module) {
    var components = {};
    module.exports = {
        register : function(objN, obj) {
            components[objN] = obj();
        },
        init: function(objN){
            return this.getInstance(objN).init;
        },
        getInstance : function(objN) {
            return components[objN];
        }
    };
});
