function setColorClass(tr)
{
    tr.attr('class', 'color_set');
    tr.children('#decor_l').attr('class', 'decor_set_l');
    tr.children('#decor_r').attr('class', 'decor_set_r');
}

function setSelColorClass(setClass, tr)
{
    if (setClass) {
        tr.attr('class', 'color');
        tr.children('#decor_l').attr('class', 'decor_l');
        tr.children('#decor_r').attr('class', 'decor_r');
    }
}

function fixHelperModified(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index)
    {
      $(this).width($originals.eq(index).width());
      $(this).parent().css({'border-collapse' : 'collapse'});
    });
    return $helper;
};

function customShowTip($el,html,d,sign,box){
    if(!$el[0])return;
    $el.addClass('wrong').focus().data('customTip',
		$('<div class="pp_tip_small"><div>'+html+'</div></div>').appendTo(box||'.bl_form')
		 .position({my: 'right bottom-8', at: 'right top', of: $el}).fadeTo(200,1)
    );
}

function customShowTipToScroll($el,msg){
    var i=1;
    $('body, html').animate({scrollTop:0},1,function(){
        if(i){
            customShowTip($el,msg);
            i=0;
        }
    })
}

function customHideTip($el){
    if(!$el[0])return;
    var tip=$el.data('customTip');
    if(!tip) return;
    $el.removeClass('wrong');
    tip.fadeTo(200,0,function(){tip.remove()});
}

function customHideAllTip(){
    $('.wrong').each(function(){
        customHideTip($(this))
    })
}

// geo editor

function geoUpdateItem(id_item) {
    var el = $('#'+id_item),
        val = el.val();
    if (val != el.data('current')) {
        $('#preloader_'+id_item).show();
        $.post(window.location.href, {cmd: 'edit', id: id_item, name: val}, function(data){
            $('#preloader_'+id_item).hide();
            if (data == 'ok') {
                el.data('current', val);
            }
        });
    }
}

function geoDeleteItem(id_item, type)
{
    geoAction('delete', id_item, type);
}

function geoHideItem(id_item, type)
{
    geoAction('hide', id_item, type);
}

function geoShowItem(id_item, type)
{
    geoAction('show', id_item, type);
}

function geoAction(cmd, id_item, type)
{
    if (type == 1) {
        id_item = getChoiceSelectChkbox();
    }

    console.log('start');

    $.post(window.location.href, {cmd: cmd, item: id_item}, function(data) {
        if (data == 'ok') {
            if (type == 1) {
                adminReloadPage();
            } else {
                if ($('[id ^= block_]').length > 1) {
                    if(cmd == 'delete') {
                        $('#block_'+id_item).animate({opacity: 0, height: 0}, 400,function(){$(this).remove()});
                    } else if (cmd == 'hide') {
                        $('#hide_item_' + id_item).hide();
                        $('#show_item_' + id_item).show();
                    } else if (cmd == 'show') {
                        $('#show_item_' + id_item).hide();
                        $('#hide_item_' + id_item).show();
                    }
                } else {
                    adminReloadPage();
                }
            }
        }
	});
}

function adminReloadPage()
{
    var urlParts = window.location.href.split('#');
    window.location.href = urlParts[0];
}

function logLoadPageTime() {
    /*$(function(){
        var endTime = new Date(), elapsedTime = Number(endTime-startTime);
        console.log("TIME LOAD PAGE: " + Number(elapsedTime/1000) + " s (" + elapsedTime + " ms)");
    })*/
    $(window).on('load', function(){
        var endTime = new Date(), elapsedTime = Number(endTime-startTime);
        console.log("TIME LOAD PAGE: " + Number(elapsedTime/1000) + " s (" + elapsedTime + " ms)");
    })
}

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

function prepareLangAdmin(){
    var $linkLang=$('#header_language .language');
    if ($linkLang[0]) {
        var notShowLang=false;
        $('#pp_language').autocolumnlist({columns: 4, clickEmpty:function(){
            notShowLang=true;
            $('#header_language_item').stop().animate({height: 'toggle'}, 300, function(){
                setTimeout(function(){notShowLang=false},100);
            });
        }});
        var w=$linkLang.width();
        $('.header_language_bl').width(w);
        $linkLang.css({backgroundPosition:(w+5)+'px 6px',opacity:1}).width(w);
        $('#header_language').hover(function (){
            if(notShowLang)return;
            $(this).find('#header_language_item').stop().animate({height: 'toggle'}, 300);
        })
    }
}