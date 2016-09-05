define(function(require, exports, module) {

    var $ = require('jquery');

    var domObject = require('domObject');

    var toolObject = require('toolObject');

    var template = require('template');

    module.exports = {
        init: function() {
            domObject.doit('/search', function(elem, object, setRule) {
                // 搜索输入框
                elem.searchGroup.clear.on('click',function(){
                    object.searchGroup.input = '';
                    toggleSearchList(false);
                });
                elem.searchGroup.input.on('keyup',function(e){
                    var value = this.value;
                    if(!$.trim(value)){
                        toggleSearchList(false);
                        return;
                    }
                    search(value);
                });
                elem.searchGroup.input.on('change',function(e){
                    var value = this.value;
                    if(!$.trim(value)){
                        toggleSearchList(false);
                        return;
                    }
                    search(value);
                });
                elem.searchList.elem.on('click','.search-keyword-item',function(e){
                    var $this = $(this);
                    var text = $.trim($this.find('.search-keyword-item-title').text());
                    searchHistory.set(text);
                    redirect(text);
                });
                function search(text){
                    toolObject.ajaxWrap({
                        url:globleURL.search,
                        data:{
                            keyword:text
                        }
                    },function(re){
                        if(re){
                            re = JSON.parse(re);
                            if(re.success){
                                var data = {
                                    list:re.data
                                };
                                var html = template('templateSearch',data);
                                elem.searchList.html(html);
                                toggleSearchList(true);
                            }
                            console.dir(re);
                        }else{
                            toggleSearchList(false);
                        }
                    });
                }
                function toggleSearchList(bool){
                    if(bool){
                        elem.searchList.elem.removeClass('hide').siblings().addClass('hide');
                    }else{
                        elem.searchList.elem.addClass('hide').siblings().removeClass('hide');
                        searchHistory.render();
                    }
                }
                var searchHistory = {
                    searchHistory:elem.searchHistory,
                    maxlength:10,
                    data:[],
                    init: function(){
                        this.get();
                        this.render();                        
                        this.searchHistory.clear.on('click',this.clear.bind(this));
                        this.searchHistory.more.on('click',function(){
                            this.searchHistory.list.elem.toggleClass('slide-up');
                        }.bind(this));
                        this.searchHistory.list.elem.on('click','.search-history-item',function(){
                            redirect($.trim($(this).text()));
                        });
                    },
                    set:function(text){
                        if(this.data.indexOf(text) >= 0) return;
                        this.data.unshift(text);
                        if(this.data.length > this.maxlength){
                            this.data.pop();
                        }
                        var value = JSON.stringify(this.data);
                        localStorage.setItem('searchHistory',value);
                    },
                    get: function(){
                        var data = localStorage.getItem('searchHistory');
                        if(data)
                            this.data = JSON.parse(data);
                    },
                    clear:function(){
                        this.data = [];
                        localStorage.removeItem('searchHistory');
                        this.render();
                    },
                    render:function(){
                        if(this.data.length){
                            var label_before = "<div class='search-history-item'>";
                            var label_after = "</div>";
                            var html = '';
                            $.each(this.data,function(index,item){
                                html += label_before+item+label_after;
                            });
                            this.searchHistory.list.html(html);
                            this.searchHistory.elem.removeClass('hide');
                        }else{
                            this.searchHistory.elem.addClass('hide');
                        }
                        
                    }
                };
                function redirect(text){
                    text = encodeURIComponent(text);
                    location.href="#/gallery/gallery/0$scontent=n,"+text;
                }
                searchHistory.init();
            });
        }
    };
});