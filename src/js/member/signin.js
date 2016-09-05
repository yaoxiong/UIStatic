define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function() {
            domObject.doit('/member/signin', function(elem, object, setRule) {
                elem.btn_singin.on('click',function(e){
                    var $this = $(this);
                    if($this.hasClass('disable')) return;
                    toolObject.ajaxWrap({
                        url: globleURL.memberSignIn
                    },function(re){
                        re = JSON.parse(re);
                        if(re.error) elem.popup.show(re.error);
                        if(re.success) {
                            var data = re.data[0];
                            $this.addClass('disable');
                            $this.text('已签到 +' + data.get_point + "分");
                            object.memberSingin.credit_num = data.total_point;
                            elem.dialog.open(function(){
                                object.dialog.credit_num = data.get_point;
                            });
                        }
                    });
                });
                var tab_title = elem.tab_title.elem;
                tab_title.find(".btn").on("click",function(e){
                    var $this = $(this);
                    var label = $this.attr('data-tab');
                    var classList = tab_title[0].classList;
                    tab_title.removeClass(classList[classList.length-1]);
                    tab_title.addClass("act-"+label);
                    var element = elem.tab_content.elem.find("[data-tab="+label+"]");
                    $(element).removeClass("hide").siblings().addClass("hide");
                });
            });
        }
    };
});