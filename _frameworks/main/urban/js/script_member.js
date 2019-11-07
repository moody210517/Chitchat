/* Connected only to authorized */
$(function(){
    alertHtmlArea = '.column_main';
})

var hideItemListEl='profile_visitors_item_',
    counterList='#narrow_visitors_count',//viewed_me_count
    alertHtmlArea = '.column_main',
    deltaScroll=800,
    durLoaderSvg=100,
    durItemsAddListToScroll=200,
    durItemsDeleteList=300,
    durLazyEffectSpeed=400,
    counterMutualAttractions;

/* Auxiliary functions for working with the page type block list */
function hideItemListUser(uid){
    $('#'+hideItemListEl+uid).slideUp(300,function(){
        $(this).remove();
        updateCounterTitle(counterList,true)
        //var counter=$(counterList),val=counter.text();
        //counter.text(val*1-1);
        if(!$('[id ^= '+hideItemListEl+']:visible')[0]){alertCustomRedirect()
        }else{loaderListUserItems(1)}
    });
}

function blockUser(uid,cmd,red){
    var cmd=cmd||'block_user',red=red||false;
    confirmHtmlClose();
    $.post(url_main+'ajax.php',{cmd:cmd,user_id:uid},function(res){
        if(checkDataAjax(res)!==false){
            if(red){window.location.href=url_main+'profile_view.php'
            }else{
                Messages.number_blocked_users++;
                $('#narrow_blocked_count').text(Messages.number_blocked_users);//user_block_list_count
                hideItemListUser(uid);
            }
        }
    })
}

function confirmBlockUser(uid,cmd,red){
    alertHtmlArea = '.column_main';
    var cmd=cmd||'block_user',red=red||false;
    confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){blockUser(uid,cmd,red)}, ALERT_HTML_ALERT);
}

function alertCustomRedirect(r,m,t){
    var r=r||'profile_view.php',
        m=m||THERE_IS_NO_ONE_HERE_YET,
        t=t||ALERT_HTML_OOOPS;
    setTimeout(function(){
        alertCustom(m,true,t);
        $('.icon_ok, .icon_close').on('click',function(){window.location.href=url_main+r});
        $('.alert_wrapper').on('click',function(){return false});
    },100);
}

/* Auxiliary functions for working with the page type block list */

/* Counter */
function updateCounter(el,count){
    $(el).text(count);
}

function updateCounterRated(count, isNew, sel){
    var sel=sel||'#narrow_rated_photos_count';
    var r=$(sel),isNew=isNew||false;
    r.text(count);
    if(isNew){r.addClass('decor')
    }else{r.removeClass('decor')}
}

function updateCounterTitle(el,inc){
    var el=el||'#narrow_private_photo_count',count,inc=inc||false;//my_friends_count
    el=$(el);
    count=el.text()*1;
    if(inc){count -=1}else{count +=1};
    if(count<0)count=0;
    el.text(count);
}

function updateCounterViewersMeProfiles(count){
    $('#narrow_visitors_count').text(count);//viewed_me_count
}

function updateCounterMutualAttractions(count){
    $('#narrow_mutual_count').text(counterMutualAttractions=count);//mutual_attractions_count
}

function updateCounterWanted(count){
    $('#narrow_want_count').text(count);//wanted_count
}
/* Counter */

function getCookieRecord(pid,r){
    var r=r||'b';
    return 'photo_'+r+'_'+pid+'='+pid;
}

function getPlaceholderImage(pid,r,pl){
    var r=r||'b',c=getCookieRecord(pid,r),pl=pl||'lazy_loader.gif';
    if(document.cookie.indexOf(c)<0){
        document.cookie=c;
    }else{pl='empty.png'};
    pl = url_tmpl_main+'images/'+pl;
    return pl;
}

function updateStatusCity(location){
    var $link=$('.status_3dcity');
    if ($link[0]) {
        $link[location?'fadeIn':'fadeOut'](200);
    }
}