define('components', [], function(require, exports, module) {
    var components = {};
    module.exports = {
        register : function(objN, obj) {
            components[objN] = obj;
        },
        getInstance : function(objN) {
            return components[objN];
        }
    }
});