var alertHtmlCustom=true, visitorOrMenuNotHover=false;

var $win=$(window), curHiState=history.state||{}, isMobileDevice;

function hoverVisitorTitleMenu(){
    var el=$(this),left=el[0].offsetLeft-4,w=$('.or',this).width();
    $('.visitors_or_item',this).css('left',(left+w)+'px')
    .stop().animate({height:'toggle'},300);
}

function stopAllPlayers(){
    var pl;
    for(var k in videoPlayers) {
        pl = videoPlayers[k];
        if (isPlayerNative) {
            if (!pl.paused) pl.pause();
        } else if (typeof pl =='object' && typeof pl.dispose == 'function'){
            if (!pl.paused()) pl.pause();
        }
    }
}
function destroyAllCustomPlayers(){
    var pl;
    if (isPlayerNative)return;
    for(var k in videoPlayers) {
        pl = videoPlayers[k];
        if (typeof pl =='object' && typeof pl.dispose == 'function'){
            pl.dispose();
            delete videoPlayers[k];
        }
    }
}

function replaceTitlePage(){
    if(typeof Encounters!=='undefined' || typeof ratePeople!=='undefined')return;
    var title='', currentRadius=$('#radius').val(),
        city=$('#filter_city').val()*1;
    if (($('#filter_people_nearby').val()*1)) {
        if (maxRadius==currentRadius && isMaxFilterDistanceCountry) {
            var country=ajax_login_status?geoPointData.country:countryTitleVisitor;
            title=lAllRegions.replace(/{country}/,country);
        } else {
            title=ajax_login_status?geoPointData.city:cityTitleVisitor;
        }
    }else if(city!=0){
        if (maxRadius==currentRadius && isMaxFilterDistanceCountry) {
            title=lAllRegions.replace(/{country}/,counterTitle);
        } else {
            title=$('#filter_module_location_title').text();
        }
    }
    if(title){
        title=tmplCityTitle.replace(/{city}/,title);
        $('.find_new_friends_in_city_now').html(title);
    }
}

$(function(){
    isMobileDevice = device.mobile() || device.tablet();

	$('.wrapper').height('');
	if (user_profile_bg_video[1]) {
        isVideoBgPageLoads=true;
		chProfileBgVideo();
	} else {
        if(!bgLast[2]&&!user_profile_bg) {
            $('.profile_bg').css('background-color','#FFF').oneTransEnd(function(){
                $(this).css('background-color','transparent');
                $('html').css({background:''});
                bgLast=['', 0, 0];
            });
        }else{
            chProfileBg(user_profile_bg, 1);
        }
		setPosToHistory();
	}

    var notShowLang=false;
    function fnShowDropDown(){
        if(notShowLang)return;
        var width = $(this).children('#current').width(),
            direction = $(this).attr('data-direction');
        $(this).find('#item').css(direction, (width + 7)+'px').stop().animate({height:'toggle'},300)
    }

    var $indexChoiceLanguage=$('.index_choice_language');
    if ($indexChoiceLanguage[0]) {
        $indexChoiceLanguage.find('ul').autocolumnlist({columns: getSiteOption('number_of_columns_in_language_selector'), clickEmpty:function(){
            notShowLang=true;
            $indexChoiceLanguage.find('#item').stop().animate({height:'toggle'},300, function(){
                setTimeout(function(){notShowLang=false},100);
            })
        }});
        $indexChoiceLanguage.hover(fnShowDropDown);
    }

    function fnShowDropDownMenu($el, up){
        if(notShowLang)return;
        up=up||false;
        var width = $el.children('#current').width(),
            direction = $el.attr('data-direction'),
            dur=300;
        $el.find('#item').css(direction, (width + 7)+'px').stop()[up?'slideUp':'slideDown'](dur);
    }

    $('#avka_link').hover(
        function(){fnShowDropDownMenu($(this))},
        function(){fnShowDropDownMenu($(this),true)})

    var $columnLang = $('#column_lang');
    if ($columnLang[0]) {
        var fnShowLang=function($el){
            if($el.is(':animated'))return;
            $el.css('left', '-'+($el.width() + 19)+'px').stop().animate({height:'toggle'},300);
        }
        $columnLang.find('ul').autocolumnlist({columns: getSiteOption('number_of_columns_in_language_selector'),
                    clickEmpty:function(){fnShowLang($('#column_lang > #column_lang_item'))}})
            //fnShowLang($('#column_lang_item'));
        $('#column_lang').click(function(){
            var item=$(this).find('#column_lang_item');
            fnShowLang(item);
        }).find('#column_lang_item').mouseleave(function(){
            var item=$(this);
            if(!item.is(':visible'))return;
            fnShowLang(item);
        })

        $doc.on('click', function(e){
            var $targ=$(e.target),$langDrop=$('#column_lang_item');
            if($targ.is('#column_lang')||$targ.closest('#column_lang')[0])return;
            if($langDrop.is(':animated')||!$langDrop.is(':visible'))return;
            fnShowLang($langDrop);
        })
    }


    $('body').on('mouseenter mouseleave', '.visitors_or_menu', function(){
        if(visitorOrMenuNotHover)return;
        var el=$(this),left=el[0].offsetLeft-8,w=$('.or',this).width();
        $('.visitors_or_item',this).css('left',(left+w)+'px')
          .stop().animate({height:'toggle'},300);
    })

    $('.visitor_title_menu_or').on('mouseenter mouseleave', hoverVisitorTitleMenu);

    $('#member_content').on('click',function(e){
        var t=$(e.target);
        if(!t.closest('#pp_add_video')[0]&&!t.is('#video_bg_user')){
            hideWinAddVideo(1);
        }
    })

    // Menu
    $('.action').hover(
        function () {
            $('ul', this).show();
        },
        function () {
            $('ul', this).hide();
        }
    );

    $(".niceRadio").each(
        function() {
        $(this).prettyCheckable( { customClass: 'niceRadio' });
    });

    $(".niceCheck").each(
        function() {
        $(this).prettyCheckable( { customClass: 'niceCheck' });
    });

    $(".search_name_list .item").hover(function () {
      $(this).find('.color').toggleClass( "selected" )
    });

    $(".search_name_list .item").click(function () {
      $(this).find('a').toggleClass( "checked" )
    });

    // Filter
    var durFilter=700,
        p=$('.part', '.bl_filter'),
        p_1=$('.part1', '.bl_filter'),
        p_2=$('.part2', '.bl_filter'),
        filterCityTitle=$('#filter_module_location_title'),
        filter_hide_part1=$('#filter_hide_part1'),
        filterRadius=$('#radius'),
        filterPartAll=$('#filter_part_all'),
        filterExt=$('#filter_extended_search'),
        filterCont=$('.count',p_1),
        age_from = $('select[name=p_age_from]', '.bl_filter'),
        age_to=$('select[name=p_age_to]', '.bl_filter'),
        hr=$('.filter_decro span a', '.bl_filter'),
        isHide=true,
        isVisiblePart2,
        filterCityTitle=$('#filter_module_location_title');

    function setStateFilterParts(){
        var state = !$('.part', '.bl_filter').is(':visible')*1;
        $.post(url_main+'ajax.php',{cmd:'set_state_filter',state:state},function(){

        });
    }

    $('.filter_decro .filter_decro_bl').click(function(){
        if(!(isSuperPowers*1)){
            window.location.href=url_main+'upgrade.php';
            return false;
        }
        //isVisiblePart2=!p_2.is(':visible');
        //var text=(!isVisiblePart2)?EXTENDED_SEARCH:BASIC_SEARCH;

        p_2.slideToggle(durFilter*.8,function(){
            /*hr.text(text).toggleClass('up')
            if(hr.is('.up_active, .down_active')){
                hr.toggleClass('down_active up_active');
            } else {
                hr.toggleClass('down_active up_active', false);
            }*/
            setArrowExtended();
        })
        return false;
    });

    function setArrowExtended(){
        isVisiblePart2=p_2.is(':visible');
        var text=(!isVisiblePart2)?EXTENDED_SEARCH:BASIC_SEARCH;
        hr.text(text).toggleClass('up');
        if(hr.is('.up_active, .down_active')){
            hr.toggleClass('down_active up_active');
        } else {
            hr.toggleClass('down_active up_active', false);
        }
    }
    filterPartAll.click(function(e){
        if (p.is(':visible')) {
            $('#filter_show_part_btn').click();
        }
    });

    filter_hide_part1.click(function(){
        isHide=true;
        var isVis=true;
        filterCont.fadeOut(durFilter*.2);
        filterExt.slideUp(durFilter*.2);

        filter_hide_part1.fadeOut(400);
        if(p_2.is(':visible')){setArrowExtended();}
        filterPartAll.stop().css('overflow', 'visible').delay(100).animate({height:'17px'},{
            step:function(h){
                if(isVis){
                    p_1.fadeOut(durFilter*.6);
                    p_2.fadeOut(durFilter*.6);
                    $(this).css('overflow', 'hidden');
                    isVis=false;
                };
                if (h<120) {
                    filter_hide_part1.hide();
                }
                if (h<60) {
                    filterCityTitle.closest('p').hide();
                }
                if(isHide&&h<30){
                    isHide=false;
                    var ageTitle='',hereToTitle='',lookingTitle='',title,
                        here_to_input=$('input[name=i_am_here_to]', '.bl_filter'),
                        here_to=$('input[name=i_am_here_to]:checked', '.bl_filter'),
                        looking=$('input[id^=p_orientation_]:checked', '.bl_filter'),
                        orientations=$('input[id^=p_orientation_]', '.bl_filter');
                    if(here_to[0]){
                        hereToTitle=lGeneral['i_am_here_to'][here_to.val()];
                    }
                    title=lGeneralTitle.replace(/{here_to}/,hereToTitle);
                    var lLooking = lSearchLooking;
                    if (!ajax_login_status&&here_to_input[0]&&!here_to[0]) {
                        lLooking = lGeneralTitleNotHereTo;
                    }
                    if(looking[0]){
                        var l=looking.length,i=1;
                        looking.each(function(){
                            lookingTitle+=lGeneral['p_orientation'][$(this).val()];
                            if(i<(l-1)&&(i+1)!=l){
                                lookingTitle+=lProfileOrientationsDelimiter;
                            }else if(l>1&&(i+1)==l){
                                lookingTitle+=lProfileOrientationsLastDelimiter;
                            }
                            i++;
                        })
                        lookingTitle+=lFieldsDelimiter;
                        lookingTitle=lLooking.replace(/{looking}/,lookingTitle);
                    } else if (orientations[0]) {
                        lookingTitle=lLooking.replace(/{looking}/,lProfileOrientationsSomebody+lFieldsDelimiter);
                    }
                    //if(!here_to[0]){
                        //var b=lookingTitle;
                        //b=b.charAt(0).toUpperCase();
                        //b=b+lookingTitle.slice(1);
                        //lookingTitle=b;
                    //}
                    title=title.replace(/{looking}/,lookingTitle);
                    if(age_from[0]&&age_to[0]){
                        ageTitle=age_from.val()+lAgeDelimiter+age_to.val()+lFieldsDelimiter;
                        ageTitle=lSearchAge.replace(/{age}/,ageTitle);
                    }
                    title=title.replace(/{age}/,ageTitle);

                    var location,currentRadius=filterRadius.val(),
                    isPeopleNearby=$('#filter_people_nearby').val()*1;
                    if(isPeopleNearby){
                        if (maxRadius==currentRadius && isMaxFilterDistanceCountry) {
                            title=title.replace(/{distance}/,'');
                            location=lSearchFromCountry.replace(/{location}/,geoPointData.country);
                        } else {
                            currentRadius=(currentRadius>0)?lSearchRadius.replace(/{radius}/,currentRadius):'';
                            title=title.replace(/{distance}/,currentRadius);
                            location=lSearchFromCity.replace(/{location}/,geoPointData.city);
                        }
                    } else {
                        var city=$('#filter_city').val()*1;
                        if(maxRadius==currentRadius && isMaxFilterDistanceCountry && city!=0){
                            title=title.replace(/{distance}/,'');
                            location=lSearchFromCountry.replace(/{location}/,counterTitle);
                        }else{
                            if(city==0){
                                title=title.replace(/{distance}/,'');
                                location=lSearchFromAll.replace(/{location}/,filterCityTitle.text());
                            } else {
                                currentRadius=(currentRadius>0)?lSearchRadius.replace(/{radius}/,currentRadius):'';
                                title=title.replace(/{distance}/,currentRadius);
                                location=lSearchFromCity.replace(/{location}/,filterCityTitle.text());
                            }
                        }
                    }



                    /*if(typeof param_geo_init != 'undefined') {
                        param_geo = param_geo_init;
                    }

                    if(maxRadius==currentRadius && isMaxFilterDistanceCountry && param_geo[2]!=0){
                        title=title.replace(/{distance}/,'');
                        location=lSearchFromCountry.replace(/{location}/,counterTitle);
                    }else{
                        if(param_geo[2]==0){
                            title=title.replace(/{distance}/,'');
                            location=lSearchFromAll.replace(/{location}/,filterCityTitle.text());
                        } else {
                            currentRadius=(currentRadius>0)?lSearchRadius.replace(/{radius}/,currentRadius):'';
                            title=title.replace(/{distance}/,currentRadius);
                            location=lSearchFromCity.replace(/{location}/,filterCityTitle.text());
                        }
                    }*/


                    title=title.replace(/{location}/,location);
                    p.find('strong').html(title);
                    p.fadeIn(durFilter).closest('.filter').addClass('svert');
                }
            },
            complete:function(){
                setStateFilterParts();
            },
            specialEasing:{height:'easeOutQuad'},
            duration:durFilter
        });
        return false;
    });

    $('.filter_show_part1', '.bl_filter').click(function () {
        isHide=true;
        filterCont.hide();
        filterCityTitle.closest('p').show();
        p.hide().closest('.filter').removeClass('svert');
        p_1.fadeIn(durFilter);
        filterPartAll.stop().css({overflow:'hidden', height:'34px'}).animate({height:p_1.outerHeight()+'px'},{
            step:function(h){
                if(isHide&&h>70){
                    isHide=false;
                    filterExt.fadeTo(durFilter*.2,1);
                    $('#filter_extended_search_label').css('right',$('#filter_extended_search_href')[0].offsetLeft+8);
                    $('.filter_decro span a', '.bl_filter').text(EXTENDED_SEARCH).removeClass('up');
                }
            },
            complete:function(){
                $(this).css('overflow', 'visible');
                filterPartAll.css('height','auto');
                setStateFilterParts();
                filter_hide_part1.fadeIn(400);

                var cssRight = (parseInt($('#radius_slider .count').css('width'))/2)+2;
                $('.bl_slider .count', '.bl_filter').css('right', -(cssRight));
                filterCont.fadeIn(durFilter*.4);
            },
            specialEasing:{height:'easeOutQuad'},
            duration:durFilter
        });
        return false;
    });
    // Filter

    /* CONTACT */
    var pp_contact=$('#pp_contact').modalPopup();
    $('#pp_contact_close').click(function(){
        pp_contact.close();return false;
    });
    $('#contact').on('click', function(){
        if(ajax_login_status){pp_contact.removeClass('pp_contact')}
        pp_contact.open();
		$.post(url_main+'ajax.php',{cmd:'pp_contact'},function(res){
            var data = jQuery.parseJSON(res);
            if (data.status)pp_contact.html(data.data);
        });
        return false;
    })
    /* CONTACT */
    /* MESSAGES */
    $('body').on('click', '.show_messages', function(){
        if (!ajax_login_status) {
			window.location.href=url_main+urlPageLogin;
			return false;
		}
        var $el=$(this);

		Messages.show($el.data('userId'));
		return false;
    })
    /* MESSAGES */
    /* CITY CHOOSE */
    $('.profile_city_choose').one('click', function(){
        var pp_choose_city=$('#pp_choose_city').modalPopup().open();

		var params;
		params = {cmd : 'pp_profile_city_choose'};

		if(typeof chooseLocationInit != 'undefined') {
			params['location'] = chooseLocationInit;
		}

		if(typeof isSearchList != 'undefined') {
			params['is_search_list'] = isSearchList;
		}

        $.post(url_main+'ajax.php',params,function(res){
            var data=checkDataAjax(res);
            if(data!==false){pp_choose_city.html(data)
            }else{/*Error server*/}
        });
        return false;
    })
    /* CITY CHOOSE */

    /*$(window).resize(function () {
        setCenteringPopup($('.pp_alert'));
    });*/

    animationDiesProfile();

    var propPrefixes = {},
        camelProp,
        e, i,
        prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml'],
        prefix = '',
        dashedPrefix = '',
        upperProp = '';

    function getPrefixedProp ( prop ) {
        camelProp = prop.replace(/(\-[a-z])/g, function($1){
            return $1.toUpperCase().replace('-','');
        });

        if (propPrefixes[camelProp] || propPrefixes[camelProp] === '')
            return propPrefixes[camelProp] + prop;

        e = document.createElement('div');

        for (i = 0; i < prefixes.length; i++) {
            prefix = prefixes[i];
            if(prefix) {
                dashedPrefix = '-' + prefix.toLowerCase() + '-';
                upperProp = prop.charAt(0).toUpperCase() + prop.substring(1);
            }

            if (typeof e.style[prefix + upperProp] !== 'undefined') {
                propPrefixes[camelProp] = dashedPrefix;
                return dashedPrefix + prop;
            }
        }

        e = null; // prevent memory leak - IE
        return '';
    }

    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    if (currentPage == 'index.php' && mainPageBgMap) {
        var cloud = $('.map_photo_move'),
            cloudPosX = 0.0,
            cloudPosY = 0.0,
            offsetX = .02,
            offsetY = .015,
            interval = 100;

        $('.map_photo_move').each(function(){
            $(this).css('transition', getPrefixedProp('transform') + ' ' + interval + 'ms linear');
            $($(this).find('.frame')).css({'transition-property': '-webkit-transform, transform, opacity'});

            $(this).data('pos', {'posX':cloudPosX, 'posY': cloudPosY, 'offsetX': getRandomNumber(5, 10) * offsetX, 'offsetY': getRandomNumber(5, 10) * offsetY});
        });

        var data = {};
        setInterval(function() {
            $('.map_photo_move').each(function(){
                data = $(this).data('pos');
                data.posX = data.posX + data.offsetX;
                if (data.posX >= 4 || data.posX <= -4) {
                    data.offsetX *= -1;
                }
                data.posY = data.posY + data.offsetY;
                if (data.posY >= 3 || data.posY <= -3) {
                    data.offsetY *= -1;
                }
                $(this).css('transform', 'translate(' + data.posX + 'px, ' + data.posY + 'px) rotate(.0001deg)')
                        .css('backface-visibility', 'hidden');
            });
        }, interval);

        cloud.mouseenter(function(){
            $(this).removeClass('map_photo_move').css('transform', 'translate(0px, 0) rotate(.0001deg)');
            return false;
        }).mouseleave(function(){
            $(this).addClass('map_photo_move').css('transform', 'translate(' + cloudPosX + 'px, ' + cloudPosY + 'px) rotate(.0001deg)');
            return false;
        });
    }

    $blIm=$('#pp_message');
    var footer = $('.pp_message .foot').on('touchstart mousedown', function(e){
        e.preventDefault();
        e.stopPropagation();
        saveEventState(e);
        $doc.on('mousemove touchmove', resizingIm)
            .on('mouseup touchend', endResizeIm);
    });

    var saveEventState = function(e){
        var container = $('.name_chat .dialog');
        if(!container[0])return;
        event_state.container_height = container.height();
        event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
        event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

        // This is a fix for mobile safari
        // For some reason it does not allow a direct copy of the touches property
        if(typeof e.originalEvent.touches !== 'undefined'){
            event_state.touches = [];
            $.each(e.originalEvent.touches, function(i, ob){
                event_state.touches[i] = {};
                event_state.touches[i].clientX = 0+ob.clientX;
                event_state.touches[i].clientY = 0+ob.clientY;
            });
        }
        event_state.evnt = e;
    };

    $('.history_back').click(function(){
        history.back();
        return false;
    });

    $('.column_narrow_invite').click(function(){
        var url = location.href.split('/')
        url.pop();
        url = url.join('/');

        FB.ui({
            method: 'send',
            link: url
        });
        return false;
    });

});

var event_state = {}, $blIm;
function endResizeIm(e){
    e&&e.preventDefault();
    $doc.off('mouseup touchend', endResizeIm)
        .off('mousemove touchmove', resizingIm);
    $.cookie('height_im', $('.name_chat .dialog').height());
};

function resizingIm(e){
    var mouse={},height;
        mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $win.scrollLeft();
        mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $win.scrollTop();

    height = event_state.container_height - event_state.mouse_y + mouse.y;
    var container = $('.name_chat .dialog');
    if(!container[0])return;
    if (height > 50 && (height + $blIm[0].offsetTop + 170) < $win.innerHeight()) {
        container.height(height);
        Messages.imH=height;
    }
};

function getHeightIm(){
    var height=$.cookie('height_im')*1;
    var t=$blIm[0].offsetTop+240,
        h=height+t, hW=$win.innerHeight();
    if (h >= hW) {
        height=hW-t;
    }
    if(height<100)height=100;
    return height;
}


/* Search results */
function hidePartFilter(){
    var btnHideFilter=$('#filter_hide_part1');
    if(btnHideFilter.is(':visible')){
        btnHideFilter.click();
        if($('.column_main')[0])
        $('body, html').animate({scrollTop:$('.column_main')[0].offsetTop+76},700);
    }
}

function showPartFilter(){
    var btnHideFilter=$('#filter_hide_part1');
    if(!btnHideFilter.is(':visible')){
        $('.filter_show_part1', '.bl_filter').click();
    }
}

function animationDiesProfile(){
    $('.filter_result .item').hover(function () {
        $(this).find('div.place').toggleClass('place_hover');
        /*$(this).find('div.chat').toggleClass('chat_hover');
        $(this).find('div.date').toggleClass('date_hover');
        $(this).find('div.make_friends').toggleClass('friends_hover');*/
        var el=$(this).find('[class ^= field_i_am_here_to_]'),
            cl=el.data('cl');
        el.toggleClass(cl+'_hover');
    });
}
/* Search results */

var alertHtmlArea = 'body';
var alertHtmlTop = false;

function popupHtml(msg, title, css, Class, wrClass, shClass) {
	closeAlert();
	return $('<div class="pp_alert '+(Class||'')+'">\
		<div class="head"><strong>'+title+'</strong> <a class="icon_close" href="#"></a></div>\
	</div>').append(msg).modalPopup({css: css, wrClass: 'alert_wrapper '+wrClass, shClass: shClass||''}).open()
}
function popupAlertHand(msg, title, css, btnDone, wrClass, shClass) {
    title = title || ALERT_HTML_SUCCESS;
    btnDone = btnDone || ALERT_HTML_BTN_DONE;
    msg='<div class="cont"><div class="success">'+msg+'</div></div>\
		<div class="foot"><input type="button" class="btn green fl_right icon_ok" /></div>';
    popupHtml(msg, title, css, 'pp_increase', wrClass, shClass).find('input').val(btnDone).click(closeAlert).focus();
}

function alertHandHtml(msg, shadow, title){
	popupAlertHand(msg, title, false, false, '', shadow ? '' : 'page_shadow_empty')
}

function alertLoaderHtml(title)
{
    var title=defaultFunctionParamValue(title, ALERT_HTML_WAITING);
    alertCustom('<img class="loader" src="'+url_tmpl_main+'images/lazy_loader.gif">',true,title);
    var pp_alert=$('.pp_alert:visible');
    pp_alert.find('.wrong').css('background','none');
    pp_alert.find('.icon_ok').hide();
}

function updateAlertLoaderHtml(msg,title)
{
    var pp_alert=$('.pp_alert:visible');
    if(pp_alert[0]){
        var title=defaultFunctionParamValue(title, ALERT_HTML_ERROR);
        pp_alert.find('.head > strong').html(title);
        pp_alert.find('.wrong').addClass('bg').html(msg);
        pp_alert.find('.icon_ok').show();
    }
}

function alertHtml(msg, shadow, title)
{
    var title=defaultFunctionParamValue(title, ALERT_HTML_ERROR);
    alertHtmlClose();
    windowCode = '<div class="pp_alert"><div class="head"><strong>'+title+
                 '</strong><a class="icon_close" href="#"></a></div><div class="cont"><div class="wrong">'+msg+
                 '</div></div><div class="foot"><input onclick="alertHtmlClose(); return false;" type="button" class="btn green fl_right icon_ok" value="' + ALERT_HTML_OK + '" /></div></div>';
    $(windowCode).modalPopup({wrClass: 'alert_wrapper', shClass: (shadow?'':'page_shadow_empty'),wrCss:{zIndex:1001}})
	 .open().find('input').click(closeAlert).focus();
}

var alertHtmlHandler = function(msg, handler, title) {
	closeAlert();
		title=title || ALERT_HTML_ARE_YOU_SURE;
		pp=$('<div class="pp_alert pp_confirm"><div class="head"><strong>'+title+
                 '</strong><a class="confirm_close icon_close" href="#"></a></div><div class="cont"><div class="question">'+msg+
                 '</div></div><div class="foot"><input type="button" class="confirm_ok btn green fl_right" value="'+ALERT_HTML_OK+'" />\
		</div></div>').modalPopup({wrClass: 'alert_wrapper',wrCss:{zIndex:1001}}).open()
	$('input', pp).click(closeAlert)
	$('.confirm_ok', pp).click(handler).focus();
}


var confirmHtmlHandler = confirmHtml = function(msg, handler, hCancel_or_title, title) {
	closeAlert();
    var noCancel=(typeof(hCancel_or_title) != 'function'),
		title=(noCancel ? hCancel_or_title : title)||ALERT_HTML_ARE_YOU_SURE;
		pp=$('<div class="pp_alert pp_confirm"><div class="head"><strong>'+title+
                 '</strong><a class="confirm_close icon_close" href="#"></a></div><div class="cont"><div class="question">'+msg+
                 '</div></div><div class="foot"><input type="button" class="confirm_ok btn green fl_right" value="'+ALERT_HTML_OK+'" /><input type="button" class="confirm_close btn black fl_right" value="'+ALERT_HTML_CANCEL+'" />\
		</div></div>').modalPopup({wrClass: 'alert_wrapper',wrCss:{zIndex:1001}}).open()
	$('input', pp).click(closeAlert)
	$('.confirm_ok', pp).click(handler).focus();
	if (!noCancel) $('.confirm_close', pp).click(hCancel_or_title)
}

var confirmHtmlRedirect = function(msg, r, hCancel_or_title, title, titleOk, titleCancel, classIcon) {
	closeAlert();
    var noCancel=(typeof(hCancel_or_title) != 'function'),
		title=(noCancel ? hCancel_or_title : title)||ALERT_HTML_ARE_YOU_SURE,
        titleOk=titleOk || ALERT_HTML_OK,
        titleCancel = titleCancel || ALERT_HTML_CANCEL,
        r=r||'profile_view.php',
        classIcon=classIcon||'question';

		pp=$('<div class="pp_alert pp_confirm"><div class="head"><strong>'+title+
                 '</strong><a class="confirm_close icon_close" href="#"></a></div><div class="cont"><div class="'+classIcon+'">'+msg+
                 '</div></div><div class="foot"><input type="button" class="confirm_ok btn green fl_right" value="'+titleOk+'" /><input type="button" class="confirm_close btn black fl_right" value="'+titleCancel+'" />\
		</div></div>').modalPopup({wrClass: 'alert_wrapper',wrCss:{zIndex:1001}}).open()
	$('input', pp).click(closeAlert)
	$('.confirm_ok', pp).on('click',function(){window.location.href=url_main+r});

	if (!noCancel) $('.confirm_close', pp).click(hCancel_or_title)
}

var confirmHtmlClose = closeAlert = alertHtmlClose = function(e) {
    if(e&&$(e.target).is('.alert_wrapper')&&$('.pp_confirm:visible').last()[0]){
        return false
    }
	if ((e&&e.target==this)||!e ){
        var el=$('.pp_alert:visible').last();
        el.close('', 0, !el.data('no_remove'));
        return false
    }
}
$(document).on('click', '.pp_alert .icon_close, .alert_wrapper', closeAlert);

function customShowTip(el,btn,html,box,shiftCenter){
    $(el).data('customTip',
		$('<div class="pp_tip_small"><div>'+html+'</div></div>').appendTo(box||'.footer')
		 .position({ my: 'center bottom-5', at: 'center+'+(shiftCenter||0)+' top', of: el}).fadeTo(0,1));
    $(el).addClass('wrong').focus();
    $(btn).prop('disabled', true);
}
function customHideTip(el,btn){
    var tip=$(el).data('customTip');
    if(!tip) return;
    $(el).removeClass('wrong');
    $(btn).prop('disabled', false);
    tip.fadeTo(0,0).oneTransEnd(function(){tip.remove()});
}

function OpenWindow( sUri, iWidth, iHeight ) {
    var sWindowName = 'win' + Math.floor( Math.random()*1000 )
    var iRealWidth = iWidth ? iWidth : 600
    var iRealHeight = iHeight ? iHeight : screen.height - 300
    var iLeft = Math.round( (screen.width-iRealWidth)/2 )
    var iTop =  Math.round( (screen.height-iRealHeight)/2 ) - 35
    var sWindowOptions = 'status=yes,menubar=no,toolbar=no'
    sWindowOptions += ',resizable=yes,scrollbars=yes,location=no'
    sWindowOptions += ',width='  + iRealWidth
    sWindowOptions += ',height=' + iRealHeight
    sWindowOptions += ',left='   + iLeft
    sWindowOptions += ',top='    + iTop
    var oWindow = window.open( sUri, sWindowName, sWindowOptions )
    oWindow.focus()
    return oWindow;
}
// mouseWheel

$.event.fixHooks.mousewheel=$.event.fixHooks.wheel={
    filter:function(e, oe){
        e.deltaY=oe.deltaY||-oe.wheelDeltaY;
        if (e.deltaY===undefined) e.deltaY=-oe.wheelDelta||0;
        e.deltaX=oe.deltaX||-oe.wheelDeltaX||0;
        e.deltaZ=oe.deltaZ||0;
        e.deltaMode=oe.deltaMode||0;
        e.toPx=function(el){
            if (e.deltaMode===1) {e.deltaY*=40; e.deltaX*=40; e.deltaZ*=40};
            if (e.deltaMode==2) {
                e.deltaY*=$(el||this).innerHeight();
                e.deltaX*=$(el||this).innerWidth();
            };
        }
        return e
    }
};

if (!window.WheelEvent) $.extend($.event.special, {
    wheel: {delegateType: 'mousewheel', bindType: 'mousewheel'},
    //mousewheel: {preDispatch: function(e) {e.type='wheel'}}
});

$.fn.wheel=function(data, fn) {
    return arguments.length? this.on('wheel', null, data, fn):this.trigger('wheel');
}
 reqAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame ||function(f,el) {f()}

// Smooth scroll

var isDisableSmoothScroll=false;
function smooth_scroll(e) {
    if (isDisableSmoothScroll) return;
    if (e.ctrlKey) return;
    e.preventDefault();
    var targ=$(e.target), l, t, x, y, to={}, data={}, isB, dur=0, scale=window.devicePixelRatio||1;
    if (!targ.parent()[0].tagName) targ=$('body');
    while (targ[0]!=$('html')[0]) {
        x=/scroll|auto/.test(targ.css('overflow-x'));
        y=/scroll|auto/.test(targ.css('overflow-y'));
        if (x||y||(isB=x=y=targ.is('body:not(.themodal-lock)'))) {
            l=(targ.data('left0')||(isB?$win:targ).scrollLeft());
            t=(targ.data('top0')||(isB?$win:targ).scrollTop());
            x=x&&e.deltaX&&(e.deltaX<0?l>0:(l+(isB?$win.width():targ[0].clientWidth)<targ[0].scrollWidth));
            y=y&&e.deltaY&&(e.deltaY<0?t>0:(t+(isB?$win.height():targ[0].clientHeight)<targ[0].scrollHeight));
            if (x||y) break;
        }
        targ=targ.parent();
    }
    if (targ[0]==$('html')[0]) return;
    if (x) {
        to.scrollLeft=data.left0=l+=Math.round(e.deltaX/scale);
        dur=Math.abs(l-targ.scrollLeft())*2.5
    };
    if (y) {
        to.scrollTop=data.top0=t+=Math.round(e.deltaY/scale);
        dur=Math.max(dur, (Math.abs(t-targ.scrollTop())*2.5))
    };
    if (isB) targ=$('body, html');

    if (dur<200)dur=200;
    targ.data(data).stop()
     .animate(to, Math.min(400, dur), 'easeOutQuad', function(){targ.data({top0: 0, left0: 0})});
}

function lazyLoadProfilePhotoInit()
{
	$('.lazy_scroll').lazyload({effect:'fadeIn', skip_invisible:false, effect_speed:400});
}

/*$.fn.oneTransEnd=function(fn){
	this.one('transitionend webkittransitionend', fn);
	if (!Modernizr.csstransitions) this.trigger('transitionend');
	return this
}*/
$.fn.oneAnimationEnd=function(fn){
	this.one('animationend webkitanimationend', fn);
    if (!Modernizr.csstransitions) this.trigger('animationend');
	return this
}

$.fn.oneTransEnd=function(fn, prop){
    //"transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd"
	var trans=Modernizr.csstransitions;
	//console.log(typeof prop);
	return trans ? this.on('webkittransitionend transitionend', function fu(e){
		if ((prop && e.originalEvent.propertyName.replace(/-webkit-|-moz-|-ms-/, '')!=prop) || e.target!=this) return;
		//console.log(e.originalEvent.propertyName, prop, e.target);
		$(this).off('webkittransitionend transitionend', fu)
		fn.call(this, e)
	}) : this.each(fn);
	return this
}

// Smooth backgrounds change

var user_profile_bg_w, user_profile_bg_h;
function chProfileBg(pic, noSave){
	if (noSave==-1) pic=$.trim(user_profile_bg);
	// prevent transform at every page loading
	//if (pic==bgLast[0]) return;
    if (pic===bgLast[0]&&!user_profile_bg_video[1]){
        $('html').css({background:''});
        return;
    }
	if (noSave==2) user_profile_bg+=' ';

	var url=url_tmpl_main+'images/patterns/'+pic,
		no=/iPhone|iPad|iPod|MSIE [5-9]/i.test(navigator.userAgent)||
			$('<div />').css('transition')===undefined||user_profile_bg_video[1],
		bg=$('.profile_bg:last')
			.css({transition: (no?'':'none'), transform: 'none', willChange: 'opacity, '+(no?'background':'transform')}),
		s=(Math.random()+(noSave?42.5:1.5))/(noSave?43:1), t=Math.random()-.5, x=noSave?50:Math.random()*10+45,
		y=(noSave?200:(Math.random()*((window.innerHeight||$win.height())-200)))+$win.scrollTop()+100-bg.offset().top;
	$('.profile_bg:not(:last)').remove();
	function trans(s,t,x,y,o){ return {
		transition: 'all '+1.2+'s, transform-origin 0s',
		transform: 'scale('+s+') rotate('+t*(noSave?.03:2)+'rad) translateZ(0)',
		transformOrigin: x+'% '+y+'px',
		opacity: o
	}};

	if (pic) {
		$(new Image()).load(function(){
			bgLast=[pic, 0, 0]; setPosToHistory();
			$('.profile_custom .cont *').removeClass('loading').removeAttr('disabled').delay(300).removeClass('preloader', 1);
			if (no) return bg.show().css({backgroundImage: 'url('+url+')'});
			bg.addClass('changing').css(trans(s, -t, x, y))
			var bg1=bg.clone().one('transitionend webkittransitionend', function(){
                $('html').css({background:''});
				bg.remove();
				bg1.css({transformOrigin: '', transition: 'none'}).removeClass('changing');
			}).css({background: 'url('+url+') 0 0 repeat'}).css(trans(1/s, t, x, y, 0))
			 .insertAfter(bg.eq(-1)).fadeTo(0,1).css({transform: '', willChange: ''});
		}).on('error', function(){user_profile_bg=bgLast[0]}).prop('src', url)
	} else {
        if(noSave==1){
           $('html').css({background:''});
        }
		$('.profile_bg[style]').css(no?{backgroundImage: 'none'}:trans(s,t,x,y,0))
		 .one('transitionend webkittransitionend', function(){$(this).removeAttr('style')});
		bgLast=['', 0, 0]; setPosToHistory();//''
	};
	if (!noSave) {
        $.post(url_main+'ajax.php',{cmd: 'set_profile_bg', bg: pic||''}, function(res){
        var data=checkDataAjax(res);
		if (data){
            var lang=$('#column_lang', '.column_narrow');
            if(lang[0]){
                if(data=='none'){$('a.language', lang).addClass('white')
                } else {$('a.language', lang).removeClass('white')}
            }
		}
	});
}
}
function setPosToHistory(){
	var main=$('.main')[0], x=$win.scrollLeft(), y=$win.scrollTop();//, prBg=defaultFunctionParamValue(prBg, user_profile_bg);
	try {history.replaceState({doc_h:main.scrollHeight, x:x, y:y}, document.title)} catch(e) {};
	if (!user_profile_bg_video[1]) name=user_profile_bg+','+(x-bgLast[1])+','+(y-bgLast[2]);
}
$('.main').on('scroll', function(){
	clearTimeout(window.isScrolling);
	isScrolling=setTimeout(setPosToHistory, 50)
})

// bg video
var profileBgPlayer, bgVideoCode, videoAlert={}, user_profile_bg_video={}, isBgVideoMute = false, bgVideoVolume = 10, bgVideoOnce = false,
	/*YTConfig={host: "https://www.youtube-nocookie.com"},*/
    isUpdateVideo=false, isYError=false, updateVideo={}, videoPrev={}, durVideoPreviev=0,
    isVideoBgPageLoads=false,isDestroyPlayerVisitor=false;
function onYouTubeIframeAPIReady() {
	var video=user_profile_bg_video;
	$('#bg_video').show()[0]
	profileBgPlayer = new YT.Player('bg_video', {
		videoId: video[0],
		playerVars: {
			showinfo: 0, autoplay: 1, controls: 0, modestbranding: 1,
			rel: 0, iv_load_policy: 3, theme: 'light', wmode: 'opaque'
		}, events: {
			onReady: function(e) {
                console.log('onReady');
                profileBgPlayer.setPlaybackQuality(profile_bg_video_quality);
                if(isBgVideoMute&&bgVideoVolume){profileBgPlayer.setVolume(bgVideoVolume)
                }else{ profileBgPlayer.mute()}
            },
			onStateChange: function(e) {
                if (e.data*1===0&&bgVideoOnce) {
                    $('#bg_video').hide(1,function(){
                        profileBgPlayer.destroy()
                    })
                    return;
                }
                if(isBgVideoMute&&bgVideoVolume){profileBgPlayer.setVolume(bgVideoVolume)
                }else if(!profileBgPlayer.isMuted()){profileBgPlayer.mute()}
                //e.data = -1 / Error
                console.log('onStateChange',e.data, 'Mute(true-if you disconnect):',profileBgPlayer.isMuted(), ', Quality:',profileBgPlayer.getPlaybackQuality(), ', Allowed quality:', profileBgPlayer.getAvailableQualityLevels());
				if (e.data*1===1) {
                    if (isUpdateVideo) {
                        isUpdateVideo=false;
                        profileVideoUpdate(1);
                    } else {
                        if (!isYError&&!isVideoBgPageLoads) {
                            hideWinAddVideo(1);
                        }
                        isVideoBgPageLoads=false;
                        $('#bg_video').stop().fadeTo(600,1);
                    }
                    videoPrev=$.extend({}, user_profile_bg_video);
				}
				if (e.data*1===0&&!bgVideoOnce) {
                    console.log('onStateChange - Play', bgVideoOnce);
                    profileBgPlayer.playVideo();
                }
                if(ajax_login_status&&!Profile.isMyProfile()&&e.data==-1){
                    destroyPlayerForVisitor();
                }
			},
            onError: function(e){
                console.log('onError');
                profileBgPlayer.mute();
                isUpdateVideo=false;
                isYError=true;
				//user_profile_bg_video[1]='';
                if(Profile.isMyProfile()){
                    var alert=(e.data==5)?'error':'disabled';
                    customHideTip(bgVideoCode, '#pp_add_video_bg');
                    if ($('#pp_add_video').fadeIn(400)[0]){
                        bgVideoCode.val('');
                        $('#pp_add_video_loader').hide();
                        $('#pp_add_video_bg').show();
                        customShowTip(bgVideoCode, $('#pp_add_video_bg'), videoAlert[alert], '#pp_add_video');
                    }
                }
                if(videoPrev[1]){
                    user_profile_bg_video=videoPrev;
                    chProfileBgVideo();
                }else if(!Profile.isMyProfile()){
                    destroyPlayerForVisitor();
                }else{
                    $('.bg_video.tumb:visible').fadeOut(400);
                    profileBgPlayer.stopVideo();
                }
			}
		}
	});
}

function destroyPlayerForVisitor() {
    if(isDestroyPlayerVisitor)return;
    isDestroyPlayerVisitor=true;
    user_profile_bg_video={};
    $('.bg_video.tumb:visible').fadeTo(600,0,function(){
        chProfileBg('',-1);
    });
    $('#bg_video').hide(1,function(){
        profileBgPlayer.destroy()
    })
}

function profileVideoUpdate(change) {
    if(!Profile.isMyProfile())return;
    $.post(url_main+'ajax.php?cmd=profile_bg_video', {code:updateVideo}, function(res){
        var data=checkDataAjax(res);
		if (data.title) {
			user_profile_bg_video=data;
		} else if (data=='get_info_video_error') {
            user_profile_bg_video={};
            if(videoPrev[1]){
                user_profile_bg_video=videoPrev;
            }
        }
        chVideoPreviev(change);
	})
}

function chProfileBgVideo(save){
	var video=user_profile_bg_video,is=false;
	if(save!==undefined) {
		if(save)video[0]=save;
		video[1]=save?1:'';
        if(save=='')videoPrev={};
        updateVideo=video;
        if(video[1]&&!isMobileDevice){is=true
        }else{profileVideoUpdate(isMobileDevice)}
	}else{
		chVideoPreviev();
	}

    if(!is_bg_video_all_page||isMobileDevice)return;
	if(profileBgPlayer) {
		$('#bg_video').fadeOut(0,function(){
            profileBgPlayer.stopVideo();
			if (video[1]) {
                isUpdateVideo=is;
                profileBgPlayer.loadVideoById(video[0]);
                profileBgPlayer.setPlaybackQuality(profile_bg_video_quality);
            }
        })
	} else if(video[1]) {
        isUpdateVideo=is;
        profileBgPlayer=$.getScript('https://www.youtube.com/iframe_api')
	}
}

function chVideoPreviev(isUpdate) {
	//console.log('tmb', user_profile_bg_video);
	var video=user_profile_bg_video, path='https://i.ytimg.com/vi/'+video[0],
		t=new Date*1, ratio=video.ratio;
    isUpdate=isUpdate||0;
	//chProfileBg('', video[1]?2:-1);
	function insRes(url){
        chProfileBg('', video[1]?2:-1);
		var prev=$('.bg_video.tumb'), cur=$(prev[0]);
		if (url) {
			cur.clone().css({backgroundImage:'url('+url+')', opacity:0})
			.insertAfter(prev.last()).stop().fadeTo(1,1).oneTransEnd(function(){//durVideoPreviev
                if (isUpdate){
                    $('#bg_video').stop().fadeTo(600, 1);
                    hideWinAddVideo(1);
                }
            	prev.remove();
                $('html').css({background:''})
			}).add('#bg_video').css({width: 100*ratio+'vh', height: 100/ratio+'vw'});
            durVideoPreviev=0;
		} else {
			prev.fadeTo(0,0)
		}
        //console.log('tmb - insRes', url);
		bgLast=[url, cur.width(), ''];
		name=bgLast.join(',')
	};
	if (video[1]&&(!bgLast[0]||bgLast[0].search(video[0]<0))) $('<img />').load(function(){
        var img=this;
        if(img.width>400||img.src==path+'/hqdefault.jpg'){
            insRes(img.src);
            return;
        }
		/*if (this.width<400) return;
		var img=this;
		insRes(img.src)
		console.log('insRes');
		if (img.src==path+'/maxresdefault.jpg') return;*/
		setTimeout(function(){img.src=path+'/hqdefault.jpg'}, Math.max(1, 100-new Date*1+t));
	}).error(function(){})[0].src=path+'/maxresdefault.jpg';
	else insRes(video[1]?bgLast[0]:0);
}

$win.resize(function(){
	if (!user_profile_bg_video[1]) return;
	bgLast[1]=$('.bg_video.tumb:last').width();
	name=bgLast.join(',');
}).on('beforeunload', function(){
    if(profileBgPlayer)profileBgPlayer.mute();
    $('#bg_video').stop().fadeOut(500);
});

function hideWinAddVideo(d){
    var pp_add_video=$('#pp_add_video:visible');
    if (pp_add_video[0]) {
        var d=d||3500;
        pp_add_video.delay(d).fadeOut(400,function(){
            $('#pp_add_video_loader').hide();
            $('#pp_add_video_bg').show();
        });
		customHideTip(bgVideoCode, '#pp_add_video_bg')
    }
}

function videoChatInvite(uid,name){
    if(!checkLoginStatus())return;
    if(!videoChat.isAllowed){
        window.location.href=url_main+'upgrade.php';
        return;
    }
    if(videoChat.price>0){
        $.post(url_main+'ajax.php',{cmd: 'get_available_credits'}, function(res){
        var data=checkDataAjax(res);
		if (data){
            var balance=data*1;
            if(balance<videoChat.price){
                confirmHtmlRedirect(videoChat.langParts.you_have_no_enough_credits,'increase_popularity.php',
                closeAlert,ALERT_HTML_ALERT, videoChat.langParts.buy_credits);
                return false;
            } else {
                //Profile.incPopOpenPayment('video_chat');
                //videoChat.invite(uid,name);
                var str=videoChat.langParts.service_costs;
                var msg=str.replace('{credit}',videoChat.price);
                str=videoChat.langParts.you_have_credits;
                var title=str.replace('{credit}',balance);
                confirmHtmlHandler(msg,function(){videoChat.invite(uid,name);return false;}, title);
            }
        }
        });
    } else {
        videoChat.invite(uid,name);
    }
}

function audioChatInvite(uid,name){
    if(!checkLoginStatus())return;
    if(!audioChat.isAllowed){
        window.location.href=url_main+'upgrade.php';
        return;
    }
    if(audioChat.price>0){
        $.post(url_main+'ajax.php',{cmd: 'get_available_credits'}, function(res){
        var data=checkDataAjax(res);
		if (data){
            var balance=data*1;
            if(balance<audioChat.price){
                confirmHtmlRedirect(audioChat.langParts.you_have_no_enough_credits,'increase_popularity.php',
                closeAlert,ALERT_HTML_ALERT, audioChat.langParts.buy_credits);
                return false;
            } else {
//                audioChat.invite(uid,name);
                var str=audioChat.langParts.service_costs;
                var msg=str.replace('{credit}',audioChat.price);
                str=audioChat.langParts.you_have_credits;
                var title=str.replace('{credit}',balance);
                confirmHtmlHandler(msg,function(){audioChat.invite(uid,name);return false;}, title);

            }
        }
        });
    } else {
        audioChat.invite(uid,name);
    }
}

function confirmBlockUserForVisitors(uid,cmd,red){
    if(!checkLoginStatus())return;
    Profile.confirmBlockUser(uid,cmd,red);
}

function sendWinkFromAdditionalMenu(uid){
    if(!checkLoginStatus())return;
    Profile.sendWinkFromAdditionalMenu(uid);
}

function refreshCaptcha(captcha){
    var captcha=captcha||'#img_join_captcha';
    $(captcha).attr('src', url_main+'_server/securimage/securimage_show_custom.php?sid=' + Math.random());
    return false;
}

function redirectUrl(href){
    window.location.href=href;
}

function redirectOrOpenMessage(href,uid){
    if(~href.indexOf('#null')){
        Messages.show(uid);
    }else{
        window.location.href=href;
    }
}

function redirectToLogin(){
    window.location.href=url_main+urlPageLogin;
}

function checkLoginStatus(){
    if (!ajax_login_status) {
        redirectToLogin();
        return false;
    }
    return true;
}

function getLoaderCl(ind,cl,sc,sp){
    var ind=ind||+new Date,
        cl=cl||'loader_btn',
        sc=sc||false,
        sp=sp||1,
        cln=$('#loader_spinner').clone();
    $('#'+ind).remove();
    return cln.attr('id',ind).addClass(cl).find('.spinner')
            .removeClass('spinnerw').addClass(!sc?'spinnerw':'').end().stop().fadeIn(sp);
}

function getLoader(cl,isHide,isWhite,notCache){
    cl=cl||'';
    isHide&&(cl=cl+' hidden');
    var key='loader_'+cl,
        clSpin=isWhite?'spinnerw':'',
        $loader=$('<div class="css_loader '+cl+'">'+
                '<div class="spinner center '+clSpin+'">'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '<div class="spinner-blade"></div>'+
                '</div>'+
            '</div>');
    return $loader;
}

function searchInterests(e){
    var interestId=$(e).attr('data-interest-id');
    window.location.href='search_results.php?set_filter_interest=1&interest='+interestId;
}

function goLink(url,params,target){
    params=params||'';
    target=target||0;
    var f=document.createElement('form');
    f.method='POST';
    f.action=url;
    if(target){
        f.target='_blank';
    }
    if(params){
        params=params.split('&');
        for (var key in params) {
            var param=params[key].split('=');
            var i=document.createElement('input');
            i.setAttribute('type','hidden');
            i.setAttribute('name',param[0]);
            i.value=param[1];
            f.appendChild(i);
        }
    }
    document.body.appendChild(f);
    f.submit();
}

function updateListenerBroadcast(users){
    if(typeof cMs == 'object')cMs.updateListener(users);
}

function connectionToBroadcast(is){
    if(typeof cMs == 'object' && is)cMs.brcInitStreamVisitor();
}