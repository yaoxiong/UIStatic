;(function($){$.scrollUp=function(options){var settings={scrollName:"scrollUp",topDistance:"300",topSpeed:300,animation:"fade",animationInSpeed:200,animationOutSpeed:200,scrollText:"Scroll to top",activeOverlay:false};if(options)var settings=$.extend(settings,options);var sn="#"+settings.scrollName,an=settings.animation,os=settings.animationOutSpeed,is=settings.animationInSpeed,td=settings.topDistance,st=settings.scrollText,ts=settings.topSpeed,ao=settings.activeOverlay;$(sn).css({"display":"none","position":"fixed","z-index":"2147483647"});if(ao){$("body").append("<div id='"+settings.scrollName+"-active'></div>");$(sn+"-active").css({"position":"absolute","top":td+"px","width":"100%","border-top":"1px dotted "+ao,"z-index":"2147483647"})}$(window).scroll(function(){if(an==="fade")$($(window).scrollTop()>td?$(sn).fadeIn(is):$(sn).fadeOut(os));else if(an==="slide")$($(window).scrollTop()>td?$(sn).slideDown(is):$(sn).slideUp(os));
else $($(window).scrollTop()>td?$(sn).show(0):$(sn).hide(0))});$(sn).click(function(event){$("html, body").animate({scrollTop:0},ts);return false})}})(jQuery);
/* 默认 */
$(function () {
    $.scrollUp({
        scrollName: 'scrollUp'
    });
});