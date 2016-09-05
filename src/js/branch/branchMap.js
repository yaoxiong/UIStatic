define(function(require, exports, module) {

    // 需要用到的jquery对象
    var $ = require('jquery');

    // 全局对象
    var scope = require('scope');

    var domObject = require('domObject');

    var baseObject = require('baseObject');

    module.exports = {
        init: function(id) {
            domObject.doit('/branch/map', id, function(elem, object, setRule) {
                var lng = Number($('.ipt_lnt').val()||121.424632);
                var lat = Number($('.ipt_lat').val()||31.17417);
                var baiduMapAK = $('.ipt_baiduAK').val();
                var path = $('.ipt_path').val();
                window.branchMap = {
                    $el: undefined,
                    ak: baiduMapAK,
                    location: undefined,
                    myIcon: undefined,
                    map: undefined,
                    targetPoint: undefined,
                    loadMapScript: function(){
                      // loading.show();
                      if(!this.ak){
                        // loading.hide();
                        alert("没有配置百度地图ak，请登录后台配置ak值");
                        return;
                      }
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = "http://api.map.baidu.com/api?v=2.0&ak="+this.ak+"&callback=branchMap.init";
                        script.id = "baidu_map";
                        document.body.appendChild(script);
                    },
                    init:function(){
                      var that = this;
                      that.$el = $('#branchMap');
                      that.setHeight();
                      var map = that.map = new BMap.Map("branchMap");
                      
                      map.centerAndZoom("上海",17);                 
                      map.enableScrollWheelZoom();                 //启用滚轮放大缩小
                      // 定位当前城市
                      var myCity = new BMap.LocalCity();
                      myCity.get(function(result){
                        map.setCenter(result.name);
                      });
                      // 添加定位控件
                      that.myIcon = new BMap.Icon(path+"/wap/statics/dest/images/map-arrow.png", new BMap.Size(25,25));
                      that.myIcon.setImageSize({width:25,height:25});
                      
                      that.initBmpControl();
                      that.getPosition();
                      
                      that.getWalkingRoute(lng, lat);
                    },
                    // 百度控件初始化
                    initBmpControl:function(){
                      var that = this;
                      var map = that.map;
                      if(!map) return;

                      var navigationControl = new BMap.NavigationControl({
                        anchor: BMAP_ANCHOR_TOP_LEFT,
                        // large类型
                        type:BMAP_NAVIGATION_CONTROL_LARGE,
                        // 启用定位
                        enableGeolocation: true
                      });
                      map.addControl(navigationControl);

                      var geolocationControl = new BMap.GeolocationControl({
                        showAddressBar:false,
                        locationIcon:that.myIcon
                      });

                      geolocationControl.addEventListener("locationSuccess", function(e){
                        // 定位成功事件
                        that.location = e.point;
                        // map.clearOverlays();
                        // that._getWalkingRoute(121.443278, 31.201725);
                      });
                      geolocationControl.addEventListener("locationError",function(e){
                        // 定位失败事件
                        alert(e.message);
                      });
                      // map.addControl(geolocationControl);
                    },
                    // 获得用户的精确位置，2秒查询一次
                    getPosition: function(){
                      var that = this;
                      var map = that.map;
                      var geolocation = new BMap.Geolocation();
                      var marker = undefined;
                      var timeID;
                      timeID = setInterval(function(){
                        // 原生定位
                        // navigator.geolocation.getCurrentPosition(function(position){
                        //   that.location = new BMap.Point(position.coords.longitude, position.coords.latitude);
                        //   if(!marker){
                        //     marker = new BMap.Marker(that.location ,{icon:that.myIcon,enableMassClear:false});
                        //     map.addOverlay(marker);
                        //   }
                        //   marker.setPosition(that.location);
                        // },function(error){
                        //   console.log("Error Code: "+ error.code);
                        //   console.log("Error Message: "+ error.message);
                        //   // alert(error.message);
                        // },{enableHighAccuracy: true,maximumAge:1000});

                        // 调百度接口定位
                        geolocation.getCurrentPosition(function(r){
                          if(this.getStatus() == BMAP_STATUS_SUCCESS){
                            that.location = r.point;
                            if(!marker){
                              marker = new BMap.Marker(r.point,{
                                icon:that.myIcon,
                                enableMassClear:false
                              });
                              // marker.setRotation(Math.atan2(121.443278-r.point.lng,31.201725-r.point.lat)*180/Math.PI);
                              map.addOverlay(marker);
                            }
                            marker.setPosition(r.point);
                          }
                        },{enableHighAccuracy: true,maximumAge:1000});
                      },1500);
                      scope.timeId.push(timeID);
                      if(window.DeviceOrientationEvent) {
                        window.addEventListener('deviceorientation', function(event){
                          if(event.alpha)  
                            marker.setRotation(event.alpha*-1);
                        }, false);
                      }
                    },
                    // 根据经纬度获取步行路径，如果定位失败就直接展示门店位置
                    getWalkingRoute: function(lng,lat){
                      var that = this;
                      var map = that.map;
                      var geolocation = new BMap.Geolocation();
                      var targetPoint = new BMap.Point(lng, lat);
                      
                      navigator.geolocation.getCurrentPosition(function(position){
                        that.location = new BMap.Point(position.coords.longitude,position.coords.latitude);
                        that.convert(that.location, function(data){
                          if(data.status === 0){
                            var walkingOption = {
                              renderOptions:{map: map, autoViewport: true},
                              onPolylinesSet:function(result){
                                if (walking.getStatus() == BMAP_STATUS_SUCCESS){
                                  var polyline = result[0].getPolyline();
                                  polyline.setStrokeColor('#355fd7');
                                  polyline.setStrokeStyle("solid");
                                }
                              }
                            };
                            var walking = new BMap.WalkingRoute(map,walkingOption);
                            walking.search(data.points[0], targetPoint);
                          }
                          // loading.hide();
                        });
                      },function(error){
                        alert("定位失败");
                        // loading.hide();
                        var mk = new BMap.Marker(targetPoint);
                        map.addOverlay(mk);
                        map.panTo(targetPoint);
                      },{
                        enableHighAccuracy: true,
                        timeout:5000,
                        maximumAge:1000
                      });
                    },
                    // 原生坐标转换为百度坐标
                    convert: function(point,callback){
                      var convertor = new BMap.Convertor();
                      var pointArr = [];
                      pointArr.push(point);
                      convertor.translate(pointArr, 1, 5, callback);
                    },
                    // 地图适应整屏幕
                    setHeight:function(){
                      var $el = this.$el;
                      if(!$el) return;
                      var topHeight = $('.top-nav').height(),height;
                      if(topHeight){
                        height = window.innerHeight-topHeight;
                        $el.css('height',height);
                      }
                    }
                  };
                if(!$('#baidu_map').length){
                    branchMap.loadMapScript();
                }else{
                    branchMap.init();
                }
            });
        }
    };
});