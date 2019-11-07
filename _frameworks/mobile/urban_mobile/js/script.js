var transEvent='transitionend webkitTransitionEnd';
$.fn.oneTransEnd=function(fn, prop){
	var el=this;
    el.on(transEvent, function f(e){
        var eProp=e.propertyName=e.originalEvent.propertyName;
        if (!eProp || new RegExp(prop||'', 'i').test(eProp)) {
            $(this).off(transEvent, f);
            fn.call(this, e);
        }
    });
	if (!window.TransitionEvent && !window.WebKitTransitionEvent) {
        setTimeout(function(){el.trigger('transitionend');},10)
    }
	return this
}

var isCriOS=navigator.userAgent.match('CriOS');
var isFxiOS=navigator.userAgent.match('FxiOS');
var isIos=/iPhone|iPad|iPod/i.test(navigator.userAgent);
var menuSwArea=30, menu_open;
$(function(){
//--SidebarMenuEffects--
	var container = $( '#st-container' ).click(function(e) {
			//console.log (e.target)
			if (e.target!=isMsDwn) return;// alert(e.target.className);
			if ($(e.target).is('.st-content-shadow, .st-menu-open button.icon_nav, .st-menu-open button.icon_nav *')) { resetMenu(); }
			else if ($(e.target).is('button.icon_nav, button.icon_nav *')) { showMenu() }
		}), pusher = $('.st-pusher'),
		showMenu = function() {
			$win.trigger('showMenu');
			menu_open=true;
			pusher.removeAttr('style');
			$('#message_text').blur();
			container[0].className = 'st-container'; // clear
			container.addClass('st-effect-3 st-menu-open');
			//var filter=($('.st-content').css('-webkit-filter')||$('.st-content').css('filter'));
			//if (!filter || filter=='none') container.addClass('no-filter')
		}, resetMenu = function() {
            menu_open=false;
			container[0].className = 'st-container';
			pusher.removeAttr('style');
		}, isMsDwn;
	//var cons=$('<textarwa style="position: fixed; z-index: 300; bottom:0; color:white; max-height:10em; overflow: auto"></textarea>').appendTo('body')
	if ($('.st-menu')[0]) {
		pusher.swipe({swipeStatus: function(e, ph, dir, d, dur, c, f){
			if (ph=='start') e.preventDefault();
			var x0=f[0].start.x, dx=Math.round(f[0].end.x-x0);
			//cons.animate({scrollTop: '+=50'}, 10)[0].innerHTML+=(x0+', '+dx+', '+ph+', '+dir+'<br>')
			//if (x0<menuSwArea&&dir=='right') container.not('.st-menu-open').addClass('st-effect-0 st-menu-open', 0)
			if (dx<-20) resetMenu();
			if (x0<menuSwArea) {
				if (e && $(e.target).is('.st-menu, #st-trigger-effects > button') && /start|cancel/.test(ph)) return;
				//if (ph=='start') pusher.css({transform: 'translateX('+20+'px)', transition: 'all .1s'})
				if (dx>1)  showMenu();
				if ((ph=='cancel'||dx<0) && isMsDwn!=e.target)  resetMenu();
				//pusher.css({transform: 'translateX('+(dx+20)+'px)', transition: 'none'})
			}
		}, threshold: 11, excludedElements: 'input, select, textarea, .noSwipe', preventDefaultEvents: false, fallbackToMouseEvents: false})
		$('.st-content').mousemove(function(e){
			if (isMsDwn) return;
			if (e.pageY && e.pageX<6) container.addClass('st-effect-3')
			else container.not('.st-menu-open').removeClass('st-effect-3')
		})
		$win.mouseup(function(e){
			setTimeout(function(){isMsDwn=0}, 5);
			if (!$(e.target).closest('.st-pusher')[0]) $('.st-pusher').mouseup();
		}).mousedown(function(e){
			if ($(isMsDwn=e.target).is('.st-menu')) showMenu()
		})
	}

    if (ajax_login_status) {
        /*$win.on('load', function(){
            preloadImagesCache(url_tmpl_mobile_images, activePage);
        })*/
        $win.on('resize orientationchange',function(){
            positionTipOnResize();
            prepareInterests();
            if ($('.no_one_found')[0]&&isOneChat=='general_chat') {
                showNoOneFound(1)
            }
        })
    } else {
        var btnIndexText,$btn,href,
        $btnIndex=$('.btn_index, ul.bl_social_buttons a').on('mousedown touchstart', function(){
            if ($('#l1',$btnIndex)[0]) return false;
            $btn=$(this);
            btnIndexText=$btn.html();
            href=this.href;
            if ($btn.hasClass('btn_fb')) {
                $btn.html('<div class="fb_f"></div>').append(getLoaderCl('l1'))
            } else {$btn.html(getLoaderCl('l1'))}
            setTimeout(function(){window.location.href=href},300);
            return false;
        });

        if(activePage=='index.php'){
            //$(window).on('popstate', function(){})
            window.addEventListener('popstate', function(e) {
                if($btn!==undefined){$btn.html(btnIndexText)}
            });
        }
    }
	var hScrl=1, sl=0,
		$cont=$('.side_menu .content, .st-content-inner').css(isMobileBrowser?{overflowY:'auto', overflowX:'hidden'}:
		 {overflowY:'scroll', overflowX:'hidden', marginRight: -25}),
		cont=$cont[0], barW=cont?(cont.clientWidth-cont.offsetWidth):0, x, y, x0, y0, moving, movingT;
	//$.cookie('scrollW', 'barW');
	$cont.css({marginRight: barW, transition: 'margin .23s .3s'});
	if (barW) $('.st-content-inner').mousemove(function(e){
		if (this.scrollHeight==this.clientHeight) return;
		//if ($(cont).is('.animated')) return;
		$(this).css({marginRight: barW*(hScrl=($win.width()-e.pageX>15)), transitionDelay: (!hScrl)*.5+'s'})
	}).mouseleave(function(){$(this).css({marginRight: barW, transitionDelay: 0})})
	//.scroll(function(){
		// $(this).clearQueue().animate({marginRight: 0}, 1).delay(600).animate({marginRight: barW*hScrl}, 0)
	// })
	$('#spotlight').on('wheel', function(e){
		//if (e.deltaX) return;
		e=e.originalEvent;
		var dx=e.deltaX||e.deltaY;
		if (e.deltaMode) dx=$('li', this).width()*(dx>0||-1);
		sl=Math.max(sl+dx,0);
		sl=Math.min(sl, this.scrollWidth-this.clientWidth);
		$(this).stop().animate({scrollLeft:sl}, Math.abs(dx*2));
		return false
	}).scrollLeft(0)

	$win.mousemove(function(e){
		var dx=e.pageX-x, dy=e.pageY-y;
		if (moving && moving[0].id!='spotlight' && !$(document.body).is('.moving') && Math.abs(dx)>Math.abs(dy)) {
			moving=0;
			$('body').removeClass('hand')
		}
		if (moving) {
			$('body').addClass('moving')
			moving.stop()
			 .animate({scrollLeft: x0-dx*(moving.is('#spotlight')), scrollTop: y0-dy}, 100)
		}
	}).mouseup(function(){
		if (moving) setTimeout(function(){
			//try {document.getSelection().collapseToStart()} catch(e) {}
			$('body').removeClass('moving hand');
			moving=0
		}, 1)
	}).on('click', '.moving a', function(e) {e.preventDefault()})

	$('.st-content-inner, #spotlight').mousedown(function(e){
		if (e.pageX<menuSwArea) return;
		var targ=$(e.target);
		if (targ.is('.header, .header *, select, option')) return;
		if ($(this).is('.st-content-inner') && this.scrollHeight==this.clientHeight) return;
		moving=$(this);
		$('body').addClass('hand')
		targ.add(targ.parents('a')).one('dragstart', function(){return !moving});
		x0=moving.scrollLeft();
		y0=moving.scrollTop();
		x=e.pageX; y=e.pageY
		//return !targ[0].draggable;
		if (this.id=='spotlight') return false;
	})

    $('.main, .wrapper, .page_shadow_empty').on('click',function(e){
        var target=$(e.target);
        if($('.tip_confirm:visible')[0]) return;
        if($('.tip_alert:animated')[0]) return;
        hideAlert();
        //if(target.is('.page_shadow_empty')){//???
           //$('#page_shadow_empty').hide();
        //}
    });

})

/* *********************** */
function showTipTop(el,msg,vis,wr,center){
    var html,id=el[0].id,vis=defaultFunctionParamValue(vis,1),
        wr=wr||'.footer',
        tip=$('#tip_'+id),
        center=center||'';
    if(!tip[0]){
        html = '<div id="tip_'+id+'" class="custom_tooltip tooltip top red">'+
                    '<div class="icon"></div>'+
                    '<div class="decor"></div>'+
                '</div>';
        tip=$(html).hide();
    }
    tip.find('.icon').html(msg);
    el.addClass('wrong');
    tip.appendTo(wr);
    if(vis){
        tip.stop().fadeIn({step:function(){showArrow(tip,el)}}).position({my:'center bottom', at:'center'+center+' top-18', of:el});
    }
}

function hideTipTop(el,isRemove){
    var $tip=$('#tip_'+el[0].id);
    if($tip[0]){
        $tip.stop().fadeOut(1,function(){
            if(isRemove){$(this).remove()}
        });
    }
}

function showTipTopError(el){
    var $tip=$('#tip_'+el[0].id);
    if(el.is('.wrong')&&$tip[0]){
        $tip.stop().fadeIn({step:function(){showArrow($tip,el)}})
            .position({my:'center bottom',at:'center top-18',of:el});
    }
}

function resetTipTopError(el){
    if (el.is('.wrong')) {
        hideTipTop(el,1);
        el.removeClass('wrong');
    }
}

function removeTipTopErrorVisible(){
    var $tip=$('.custom_tooltip:visible');
    if($tip[0]){
        $tip.stop().fadeOut(1,function(){$(this).remove()});
    }
}

function showTipTopErrorCondition(el){
    if($('#tip_'+el[0].id+':visible')[0]){
        resetTipTopError(el);
    }else{
        removeTipTopErrorVisible();
        showTipTopError(el);
    }
}

function showArrow(tip,el){
    if(tip.position().top>0){tip.find('.decor').addClass('decor_top')
    }else{tip.find('.decor').removeClass('decor_top')}
    return 18;
}

function positionTipOnResize(){
    var $tip=$('.custom_tooltip:visible');
    if($tip[0]){
        var $el=$('#'+$tip[0].id.replace(/tip_/,''));
        if($el[0]){
            $tip.position({my:'center bottom',at:'center top-18',of:$el});
            showArrow($tip,$el);
        }
    }
}

function showAlert(msg,wr,vis,t,isCloseClickShadow){
    var html,tip,vis=vis||'red',wr=wr||'.wrapper',t=t||0,isCloseClickShadow=isCloseClickShadow||0;
    tip=$('.tip_alert');
    if(!tip[0]){
        html = '<div class="bl_tooltip_btn center tip_alert">'+
                '<div class="tooltip  '+vis+'">'+
                    '<div class="icon"></div>'+
                    '<div class="decor no_arrow"></div>'+
                '</div>'+
                '</div>';
        tip=$(html);
    }

    tip.hide().find('.icon').html(msg);//.addClass(view)
    $('#page_shadow_empty').show();
    tip.appendTo(wr).stop().fadeIn(200).css({marginTop:'-'+tip.innerHeight()/2+'px'});
    if(t||vis=='blue'){
        if(vis=='blue')t=2000;
        hideAlert(t);
    }
    if(isCloseClickShadow){
        $('#page_shadow_empty').one('mousedown touchstart',function(){hideAlert(1)})
    }
}

function hideAlert(t){
    var t=t||1;
    setTimeout(function(){
        $('.tip_alert').stop().fadeOut(200,function(){
            $('#page_shadow_empty').hide();
        });
    },t)
}

function showConfirm(msg, btnDone, btnCancel, callback, vis, wr, callbackCancel){
    var html,vis=vis||'red',wr=wr||'#st-container',
        tip=$('.tip_confirm'),$shadow=$('#page_shadow_empty');
    if(!tip[0]){
        html = '<div class="bl_tooltip_btn center tip_confirm" >'+
                    '<div class="tooltip '+vis+'"><div class="icon"></div></div>'+
                    '<div class="tooltip_foot '+vis+'">'+
                    '<div class="fl_right">'+
                        '<a class="btn_done btn_sm '+vis+'" href="#"></a>'+
                        '<a class="btn_cancel btn_sm grey" href="#"></a>'+
                    '</div>'+
                    '</div>'+
                '</div>';
        tip=$(html);
    }
    tip.hide().find('div.icon').html(msg);
    $('a.btn_cancel', tip).html(btnCancel).one('click',function(){
        if(typeof callbackCancel==='function'){
            callbackCancel();
        }
        hideConfirm();
        return false;
    })
    $('a.btn_done', tip).css('width','auto').html(btnDone)
    .one('click',function(){
        if(typeof callback==='function'){
            callback();
        }
        hideConfirm();
        return false;
    });

    tip.appendTo(wr).stop().fadeIn(200).css({marginTop:'-'+tip.innerHeight()/2+'px'});
    $shadow.show();
}

function hideConfirm(){
    var tip=$('.tip_confirm');
    if(tip[0]){
        $('.tip_confirm').stop().fadeOut(200,function(){
            $(this).remove();
            $('#page_shadow_empty').hide();
        });
    }
}

function hideCustomTip(isRemove){//settings
    var isRemove=isRemove||false
    $('.custom_tooltip, .tip_confirm, .tip_alert').hide(1,function(){
        if(isRemove){$(this).remove()}
        $('#page_shadow_empty').hide();
    });
}

function getLoaderCl(ind,cl,sc,sp){
    var ind=ind||+new Date,
        cl=cl||'loader_btn',
        sc=sc||false,
        sp=sp||1,
        cln=$('#loader_redirect').clone();
    $('#'+ind).remove();
    return cln.attr('id',ind).addClass(cl).find('.spinner')
            .removeClass('spinnerw').addClass(!sc?'spinnerw':'').end().stop().fadeIn(sp);
}

function hideLoaderCl(ind,sp){
    var sp=sp||1;
    $('#'+ind).stop().fadeOut(sp,function(){$(this).remove()});
}
/* *********************** */

function getLoader(cl,w){
    var cl=cl||'loader_btn',
        w=w||false;
    return $('#loader_redirect').addClass(cl).find('.spinner').addClass(!w?'spinnerw':'').end();
}


/*function getNameTip(el, view, onId){//Not ????
    var name = el.attr('name'),onId=onId||false;
    if (typeof name == 'undefined'||onId){
        name = el.attr('id')
    }
    return name + '_' + view;
}

function customShowTip(sel, msg, box, view, btn, noWrong, noArrow){//Not ????
    var html, tip,
        noWrong = noWrong||false,
        noArrow = noArrow||false,
        box = box||'.footer',
        view = view||'red',
        el = $(sel), name = getNameTip(el,view);
    tip=$('#tip_' + name);
    noArrow = noArrow?'no_arrow':'';
    if(!tip[0]){
        html = '<div id="tip_' + name + '" class="custom_tooltip tooltip top ' + view + '">'+
                    '<div class="icon"></div>'+
                    '<div class="decor ' + noArrow + '"></div>'+
                '</div>';
        tip=$(html).hide()
    }
    //el.focus();
    if (view == 'red' && !noWrong) {
        el.addClass('wrong');
    }
    //if($(btn)[]){$(btn).prop('disabled', true);}
    tip.find('.icon').html(msg);
    tip.appendTo(box).stop().fadeTo(200,1).position({ my: 'center bottom', at: 'center top-18', of: sel});
}

function setDecor(tip,el){//Not ????
    var ht=el.offset().top,
        hb=$(window).height()-ht-el.outerHeight()+$('.st-content').scrollTop();
    if(ht<hb){tip.find('.decor').addClass('decor_top')
    }else{tip.find('.decor').removeClass('decor_top')}
    return 18;
}

function showTipError(el,view,onId){//Not ????
    var view=view||'red',
        onId=onId||false,
        $tip=$('#tip_' + getNameTip(el,view,onId))
    if(el.is('.wrong')&&!$tip.is(':visible')){
        $tip.stop().fadeTo(100,1)
            .position({my:'center bottom',at:'center top-'+setDecor($tip,el),of:el});
    }
}

function hideTipError(el,view,onId,isRemove){//Not ????
    var view=view||'red',
        onId=onId||false,
        isRemove=isRemove||false,
        $tip=$('#tip_' + getNameTip(el,view,onId));
    $tip.stop().fadeOut(1,function(){
        if(isRemove){$(this).remove()}
    });
}

function resetTipError(el,view,onId){//Not ????
    var view=view||'red',
        onId=onId||false;
    if (el.is('.wrong')) {
        hideTipError(el,view,onId,1);
        el.removeClass('wrong');
    }
}*/

function imgResize(img, dur, top){
    var img=img||$('#profile_view_photo > img'),
        w, h, top=top||45,dur=dur||400,
        srcW=img[0].naturalWidth,srcH=img[0].naturalHeight,
        ratio=srcW/img[0].naturalHeight,
        limitW=$win.width(),
        wndH=$win.height(),
        limitH=wndH-top,
        wndRatio=limitW/ limitH;

	if(ratio > wndRatio) {
		if(img.outerWidth()> limitW) {
			w=limitW;
		} else {
			if(limitW<=srcW) {
				w=limitW;
			} else {
				w=srcW;
			}
		}
		h=w/ratio;
	} else {
		if(img.outerHeight()>limitH) {
			h =limitH;
		} else {
			if(limitH<= srcH) {
				h=limitH;
			} else {
				h=srcH;
			}
		}
		w=h*ratio;
	}
    img.css({transition:'', transform:''});
    if (wndH > top + h && wndH - (top + h) < 70) {
        h = wndH - top;
        w = h * ratio;
        img.outerWidth(w).outerHeight(h).css({top:top, 'margin-left': 0}).fadeIn(dur);
    } else {
        img.outerWidth(w).outerHeight(h).css({top:(wndH+top-h)/2, 'margin-left': 0}).fadeIn(dur);
    }

    if (w > limitW) {
        img.css({'margin-left': -1 * (w-limitW)/2});
    }
}
function resImg(img) {
    if (!img) return;
    var w=img.naturalWidth,
        W=Math.min(w, window.innerWidth),
        dH=window.innerHeight-45-img.naturalHeight/w*W
    $(img)[dH<70?'addClass':'removeClass']('resize')
}

function prepareInterests() {
    var b=$('.list_interest_photo_cont'), i=b.find('.item');
    if (i[0]) {
        var last=i.last(), hi=i.eq(0).outerHeight(), h=$('#profile_gifts_list').outerHeight()+15;
        //b.css({maxHeight:'140px'});
        if(!last.is('.nopic'))last=[];
        i.each(function(){
            var el=$(this);
            if((el.offset().top+hi)>h){
                el.removeClass('to_hide',0);
                last[0]&&last[i.not('.to_hide').length==1?'addClass':'removeClass']('to_hide',0);
            }else{
                el.addClass('to_hide',0);
            }
        });
        if(last[0]){
            var hide=b.find('.to_hide'),m=0;
            if(hide[0])m=hide.length;
            if(last.data('tmpl')){
                last[0].innerHTML=last.data('tmpl').replace(/{number}/, last.data('count')+m);
            }
        }
    }
}

function preloadImagesPage(url, p) {
    $.preloadImages(
        url+'icon_tooltip_error.png',
        url+'icon_tooltip_error_blue.png',
        url+'btns.png',
        url+'shadow_tooltip_foot.png',
        url+'tooltip_decor_red.png',
        url+'tooltip_decor_red_top.png',
        url+'cloud_hover.png',
        url+'icon_nav_profile.png',
        url+'who_likes_you.png',
        url+'who_likes_you_select.png',

        // Profile view
        url+'icon_blocked_photo.png',
        url+'nophoto_b.png',
        url+'photo_blocked.png',
        url+'icon_link_edit.png',

        // Upgrade
        url+'icon_activate_encounters.png',
        url+'icon_activate_chat.png',
        url+'icon_activate_invisible.png',
        url+'icon_activate_special.png',
        // Search results
        url+'icons_check_photo.png',
        url+'list_photo_decor_green.png',
        // Profile photo
        url+'icons_pp_description.png',
        // gear
        url+'icon_settings.png'
    )
}

function preloadImagesCache(url, p) {
    $.preloadImages(
        // Upgrade
        url+'icon_activate_encounters.png',
        url+'icon_activate_chat.png',
        url+'icon_activate_invisible.png',
        url+'icon_activate_special.png',
        // Search results
        url+'icons_check_photo.png',
        url+'list_photo_decor_green.png',
        // Profile photo
        url+'icons_pp_description.png',
        // gear
        url+'icon_settings.png'
    )
}
/*$win.on('beforeunload', function(){
	var W=$win.width(), H=$win.height()-50, n=W>400?5:(W>300?4:3), h=W/n*1.1;
	$.cookie('on_page', Math.ceil(H/h)*n);
	$.cookie('on_line', n)
})
*/

function showNoOneFound(show){
    var $wnd = $(window),show=show||0;
    var $el=$('.no_one_found');
    if(!show)$el.css({display:'table'});
    var h=$wnd.height()-$el.offset().top-$wnd.scrollTop();
    $el.height(h);
    $('.no_one_found span').height(h-145)
}

function updateStatusCity(location,d,cont){
    if(!isWebglDetect)return;
    var $link=$('.status_3dcity',cont||'.bl_info_photo_top .name');
    if ($link[0]) {
        location=location||$link.is('.to_show');
        $link[location?'fadeIn':'fadeOut'](d||200);
    }
}

function redirectToLogin(){
    window.location.href=url_main+'join.php?cmd=please_login';
}

function checkLoginStatus(){
    if (!ajax_login_status) {
        redirectToLogin();
        return false;
    }
    return true;
}

function getEventOrientation(){
    var ev='resize orientationchange';
    if(isIos && typeof window.orientation!='undefined'){
        ev='orientationchange';
        if((isFxiOS || isCriOS) && activePage=='profile_view.php'){
            ev='resize orientationchange';
        }
    }
    return ev;
}

function getTimeOrientation(){
    var t=10;
    if(isIos)t=100;
    if(isFxiOS||isCriOS)t=200;
    return t;
}

function initStyle(){
    var fn=function(){
        var vh=$win[0].innerHeight;
        $('#style_calc')[0].innerHTML=[
            "#video-container{height:", (vh-96), "px;}"
            ].join("");
        }
    fn();
    $win.on(getEventOrientation(), function(){setTimeout(fn,getTimeOrientation())});
}