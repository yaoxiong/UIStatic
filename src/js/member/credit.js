define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');

    module.exports = {
        init: function(action) {
            switch (action){
                case '' : 
                    domObject.doit('/credit', function(elem, object, setRule) {

                        var tab_title = elem.tab_title.elem;
                        var creditExchangeCpn = elem.creditExchangeCpn.elem;
                        var creditExchangeGood = elem.creditExchangeGood.elem;
                        creditExchangeCpn.find('.btn-exchange').on('click',function(){
                            var $this = $(this);
                            var $closest = $this.closest('.brief-item');
                            var cpnid = $closest.children('.cpnid-ipt').val();
                            if($closest.hasClass('exchanged')) return;
                            
                            toolObject.ajaxWrap({
                                url:globleURL.creditExchangeCpn,
                                data:{
                                    cpns_id:cpnid
                                },
                                type:'POST'
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error);
                                }
                                if(re.success){
                                    elem.popup.show(re.success);
                                    re = re.data[0];
                                    object.creditHeader.creditVal = re.total_point;
                                    if(re.remain && re.remain == 0){
                                        $this.text('已兑换');
                                        $closest.addClass('exchanged');
                                    }
                                    
                                }
                                console.dir(re);
                            });
                        });
                        creditExchangeGood.find('.btn-addcart').on('click',function(){
                            var $this = $(this);
                            var $closest = $this.closest('.brief-item');
                            var stock = $closest.find('.stock-ipt').val();
                            var goodid = $closest.find('.goods-ipt').val();
                            var productid = $closest.find('.product-ipt').val();
                            var data = {
                                goods:{
                                    goods_id: goodid,
                                    product_id: productid,
                                    num:1
                                },
                                mini_cart:true,
                                stock:stock
                            };
                            toolObject.ajaxWrap({
                                url:globleURL.creditExchangeGood,
                                data:data,
                                type:'POST'
                            },function(re){
                                re = JSON.parse(re);
                                if(re.error){
                                    elem.popup.show(re.error);
                                }
                                if(re.success){
                                    elem.popup.show(re.success);
                                }
                                console.dir(re);
                            });
                        });
                        tab_title.find(".btn").on("click",function(e){
                            var $this = $(this);
                            var label = $this.attr('data-tab');
                            var classList = tab_title[0].classList;
                            tab_title.removeClass(classList[classList.length-1]);
                            tab_title.addClass("act-"+label);
                            var element = elem.tab_content.elem.find("[data-tab="+label+"]");
                            $(element).removeClass("hide").siblings().addClass("hide");
                        });
                    });break;
                case 'history' : 
                    domObject.doit('/credit/history', function(elem, object, setRule) {
                        console.log('point_history');
                    });break;
                case 'note' : 
                    domObject.doit('/credit/note', function(elem, object, setRule) {
                        console.log('point_note');
                    });break;
            }
        }
    };
});