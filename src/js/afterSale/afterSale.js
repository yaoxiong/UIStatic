define(function(require, exports, module) {

    // 需要用到的jquery对象
    $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    var toolObject = require('toolObject');

    var isLoading = false;

    var lazyLoad = (function(){
        var lastElems;
        var windowViewPortHeight;
        function isInViewPort(elem){
            var rect = elem.getBoundingClientRect();
            if(rect.top === 0) return false;
            if(rect.top < windowViewPortHeight){
                return true;
            }
            return false;
        }
        return {
            init:function(elems,callback){
                lastElems = elems;
                windowViewPortHeight = window.innerHeight - ($('.bottom-nav').height()||0);
                $(window).off('scroll');
                $(window).on('scroll',function(e){
                    if(isLoading) return;
                    $.each(lastElems,function(index,item){
                        if(!item) return;
                        if(isInViewPort(item)) callback($(item));
                    });
                });
            },
            setLastElems:function(elems){
                lastElems = elems;
            },
            isInViewPort: isInViewPort
        };
    })();

    module.exports = {
        init: function(action,hash) {
            switch (action){
                case 'list':
                    domObject.doit('/aftersale/list', function(elem, object, setRule) {
                        var ordersList = $('.orders-list');
                        var last = [];
                        var page = {};
                        last = ordersList.find('.orders-item').last()[0];
                        page = {
                            curpage : 1,
                            maxpage : 2
                        };
                        // 预先加载一次数据
                        
                        fetchData();
                        lazyLoad.init(last,function($item){
                            fetchData();
                        });
                        function fetchData(){
                            isLoading = true;
                            if(page.curpage >= page.maxpage) return;
                            toolObject.ajaxWrap({
                                url:globleURL.afterrecOrders,
                                data:{
                                    'npage':page.curpage + 1
                                }
                            },function(re){
                                re = JSON.parse(re);
                                if(re.success){
                                    var data = re.data[0];
                                    var curPage, arr=[];
                                    page.maxpage = data.maxpage;
                                    if(page.curpage == data.curpage || page.curpage == data.maxpage){
                                        $('.text-loading').text('没有更多了');
                                    }
                                    page.curpage = data.curpage;

                                    curPage = page;
                                    if(!data.is_empty){
                                        currentTab.elem.find('.text-loading').before(data.html);
                                        isLoading = false;
                                    }
                                    var last = ordersList.find('.orders-item').last()[0];
                                    lazyLoad.setLastElems(last);
                                    if(lazyLoad.isInViewPort(last) && curPage.curpage < curPage.maxpage){
                                        fetchData();
                                    }
                                }
                            });
                        }
                    });
                    break;
                case 'apply':
                    domObject.doit('/aftersale/apply',hash, function(elem, object, setRule) {
                        var form = elem.formValidate.elem;
                        var $btnSubmit = elem.formSubmit.elem;
                        var formIpts = $('.well input,textarea').add(form.children('input')).not('.aftersale-apply-shoplist input');

                        var selectedProductList = [];
                        var productBns = form.find('.ipt-product-bn');
                        // 表单验证
                        function formValidateHandle(){
                            elem.formValidate.validator(function(bool,ele){
                                if(!selectedProductList.length || !bool){
                                    $btnSubmit.addClass("disabled");
                                }else{
                                    $btnSubmit.removeClass("disabled");
                                }
                            });
                        }
                        // 表单自动验证绑定
                        function formAutoValidate(ipts){
                            ipts = $('input,textarea');
                            formValidateHandle();
                            ipts.on("change",formValidateHandle);
                        }

                        productBns.on('change',function(){
                            var $this = $(this);
                            var goodItem = $this.closest('.goods-item')[0];
                            if(this.checked){
                                selectedProductList.push(goodItem);
                            }else{
                                selectedProductList.splice(selectedProductList.indexOf(goodItem),1);
                            }
                        });
                        formAutoValidate();
                        function uploadData(){
                            if(!selectedProductList.length) return;
                            var str = formIpts.serialize();
                            $.each(selectedProductList,function(index,item){
                                str += "&" + $(item).find('input').serialize();
                            });
                            return str;
                        }
                        elem.formSubmit.on('click',function(){
                            var $this = $(this);
                            var hash = uploadData();
                            if($this.hasClass('disabled') || !hash) return;
                            elem.formValidate.formSubmit(form,hash,function(re){
                                if(re.error){
                                    elem.popup.show(re.error,1000);
                                }
                                if(re.success){
                                    elem.popup.show(re.success,1000,function(){
                                        location.hash = '#/aftersale/list';    
                                    });
                                }
                            });
                        });
                    });
                    break;
                case 'progress':
                    domObject.doit('/aftersale/progress',hash, function(elem, object, setRule) {
                        console.log('apply: '+hash);
                    });
                    break;
                default:
                    domObject.doit('/aftersale', function(elem, object, setRule) {
                        var $body = $('body');
                        var tabContentArrays = $('.orders-list');
                        var currentTab = {
                            label:'mall',
                            elem:tabContentArrays.first()
                        };
                        // Tab 切换
                        var orderNav = elem.afterlist.orderNav.elem;
                        orderNav.on("click", ".btn" , function(){
                            var $this = $(this);
                            currentTab.label = $this.attr('data-tab');
                            orderNav.attr('data-act', $this.index()+1);
                            tabContentArrays.each(function(index,item){
                                var $item = $(item);
                                if($item.attr('data-tab') === currentTab.label){
                                    currentTab.elem = $item;
                                    $item.removeClass('hide').siblings().addClass('hide');
                                }
                            });
                            isLoading = false;
                            fetchData();
                            $body.scrollTop(0);
                        });

                        var last = [];
                        var page = {};
                        tabContentArrays.each(function(index,item){
                            var $item = $(item);
                            last.push($item.find('.orders-item').last()[0]);
                            page[$item.attr('data-tab')] = {
                                curpage : 1,
                                maxpage : 2
                            };
                        });
                        // 预先加载一次数据
                        fetchData();
                        lazyLoad.init(last,function($item){
                            fetchData();
                        });
                        function fetchData(){
                            isLoading = true;
                            var type = currentTab.label == "shop"? "online":"";
                            if(page[currentTab.label].curpage >= page[currentTab.label].maxpage) return;
                            toolObject.ajaxWrap({
                                url:globleURL.afterlistOrders,
                                data:{
                                    'npage':page[currentTab.label].curpage + 1,
                                    'type':type
                                }
                            },function(re){
                                re = JSON.parse(re);
                                if(re.success){
                                    var data = re.data[0];
                                    var curPage, arr=[];
                                    page[currentTab.label].maxpage = data.maxpage;
                                    if(page[currentTab.label].curpage == data.curpage || data.curpage== data.maxpage){
                                        currentTab.elem.find('.text-loading').text('没有更多了');
                                    }
                                    page[currentTab.label].curpage = data.curpage;
                                    
                                    curPage = page[currentTab.label];
                                    if(!data.is_empty){
                                        currentTab.elem.find('.text-loading').before(data.html);
                                        isLoading = false;
                                    }
                                    tabContentArrays.each(function(index,item){
                                        var $item = $(item);
                                        arr.push($item.find('.orders-item').last()[0]);
                                    });
                                    lazyLoad.setLastElems(arr);
                                    if(lazyLoad.isInViewPort(currentTab.elem.find('.orders-item').last()[0]) && curPage.curpage < curPage.maxpage){
                                        fetchData();
                                    }
                                }
                            });
                        }
                        
                    });
            }
            
        }
    };
});