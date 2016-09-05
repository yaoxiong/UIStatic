define( [
    "../core"
], function( jQuery ) {

"use strict";

// Register as a named CMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous CMD modules. A named CMD is safest and most robust
// way to register. Lowercase jquery is used because CMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an CMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// CMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.cmd ) {
    define( "jquery", [], function() {
        return jQuery;
    } );
}

} );
