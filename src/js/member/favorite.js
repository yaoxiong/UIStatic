define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function() {
            domObject.doit('/member/favorite', function(elem, object, setRule) {
                var del_favlist = [];
                var del_favlist_dom = [];
                $.each(elem.fav_list, function(index,item){
                    var aside = item.elem.find('.goods-item-aside');
                    var checkbox = item.elem.find('input[type="checkbox"]')[0];
                    aside.on('click',function(e){
                        var $this = $(this);
                        checkbox.checked = !checkbox.checked;
                        $(checkbox).trigger('change');
                    });
                    $(checkbox).on('change',function(e){
                        if(this.checked){
                            del_favlist.push(this.value);
                            del_favlist_dom.push(item);
                        }else{
                            del_favlist.splice(del_favlist.indexOf(this.value),1);
                            del_favlist_dom.splice(del_favlist_dom.indexOf(item),1);
                        }
                    });
                });
                elem.favlistDel.on('click',function(e){
                    if(!del_favlist.length){
                        elem.popup.show('至少选择一项',1000);
                        return;
                    }
                    elem.favlistDel.mutiRemoveFavorite(del_favlist,function(re){
                        if(re.error){
                            elem.popup.show(re.error,1000);
                        }
                        if(re.success){
                            $.each(del_favlist_dom,function(index,item){
                                item.remove();
                            });
                            del_favlist = [];
                            del_favlist_dom =[];
                            if(!$('.products-list').children().length){
                                elem.empty.elem.addClass('show');
                            }
                        }
                    });
                });
            });
        }
    };
});