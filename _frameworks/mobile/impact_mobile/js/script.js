var cacheJq={};
var durOpenPopup=350;
var transEvent='transitionend webkitTransitionEnd';
var animateEvent='animationend webkitanimationend';
var isChangedLanguage=false;
var accessFeature=['3d_city', 'game_choose', 'street_chat', 'who_likes_you'];
var isCriOS=navigator.userAgent.match('CriOS');
var isFxiOS=navigator.userAgent.match('FxiOS');
var isIos=/iPhone|iPad|iPod/i.test(navigator.userAgent);
var movingWrap;

reqAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame ||function(f,el) {f()}

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

$.fn.oneAnimationEnd=function(fn){
    var el=this;
    el.on(animateEvent, function f(e){
        $(this).off(animateEvent, f);
        fn.call(this, e);
    });
    if (!window.AnimationEvent && !window.WebKitAnimationEvent) {
        setTimeout(function(){el.trigger('animationend')},10)
    }
	return this
}

var $jq = getCacheJq = function(sel,context){
    context=context||false;
    var key=sel;
    if(context!==false){
        key=sel+'_'+context;
    }
    if(typeof cacheJq[key] == 'undefined' || !cacheJq[key][0]){
        if(context){
            cacheJq[key]=$(sel,context);
        }else{
            cacheJq[key]=$(sel);
        }
    }
    return cacheJq[key];
}

function clearCacheJq(){
    cacheJq={};
}

var $layerBlockPage,$loaderLayerBlockPage,$pageShadowEmpty;
$(function(){
    $(window).on('popstate',function(){
        //popup send_message
        console.log('POPSTATE:', pageHistory, location.href, curPageData.url, location.href.indexOf(curPageData.url.split('#')[0]) !== -1);
        if (ajax_login_status) {
            if($('.popup.send_message:visible')[0]){
                clProfile.resetHash(curPageData.url);
                $('.pp_body').click();
                return false;
            } else if(clCommon.isVisibleHeaderMenu()){
                clProfile.resetHash(curPageData.url);
                !isUploadPage&&clCommon.hideHeaderMenu();
                return false;
            }
            var path=location.href.split('#');
            path=path[0].split('/');
            //console.log('!!!!!!!!PATH:',curPageData.url.split('#')[0], path[path.length-1], curPageData.url.split('#')[0]==path[path.length-1]);
            if(location.hash
                &&curPageData.url.split('#')[0]==path[path.length-1]){
                //&& location.href.indexOf(curPageData.url.split('#')[0]) !== -1){
                if(isCriOS)setTimeout(function(){setPageTitle(curPageData.title)},0);
                return false;
            }
        }
        if(!setAjaxLoad)return;
        if(pageHistory.length>0){
            var page=pageHistory.pop();
            setErrorHistoryLoad(function(){
                //console.log(111, pageHistory, page, curPageData);
                pageHistory.push(page);
                history.pushState(pageHistory, null, curPageData.url);
                history.replaceState(pageHistory, curPageData.title, curPageData.url);
            })
            setEndHistoryLoad(function(){
                //console.log(222, pageHistory, page);
                history.pushState(pageHistory, null, page.url);
                setPageTitle(page.title);
            })
            getPage(false,url_main+page.url,true);
        }else{
            history.pushState(pageHistory, null, curPageData.url);
            setPageTitle(curPageData.title);
        }
        return false;
    })

    $('body').on('click', '.go_to_page, #toTop, .popup_alert a, a.empty', function(e){
        var $el=$(this);
        if ($el.closest('.popup_alert')[0]) {
            if (setAjaxLoad) {
                $el.data('notLoader',true);
                goToPage(this);
                return false;
            }
        }
        if($el.is('.empty')){
            return false;
        }
        if($el.is('.go_to_page')){
            if (setAjaxLoad) {
                var action=$el.data('action');
                if (action && in_array(action, accessFeature)) {
                    checkAccessFeature(this,action);
                    return false;
                }
                if($el.is('.logout')){
                    clCommon.showHeaderMenu(true,function(){
                        showConfirm(l('do_you_want_to_log_out'),goToLogOut,false,false,false,false,true);
                    });
                    return false;
                }
                //if (!$el.is('.no_load_ajax')){
                return goToPage(this);
                    //return false;
                //}
            }
        }
        if($el.is('#toTop')){
            $jq('#main').animate({scrollTop:0},300)
        }
    })

    $('#main_wrap').on('touchmove', function(e){
        var n=e.originalEvent.touches.length;
        if(n>1)e.preventDefault();
    })/*.dblclick(function(e){
        e.preventDefault();
    })*/
    /*$('body').on('touchstart mousedown', '#icon_nav_menu', function(e){
        clCommon.showHeaderMenu();
        e.preventDefault();
    })*/

    $layerBlockPage=$('#layer_block_page');
    $loaderLayerBlockPage=$('#loader_layer_block_page');
    $pageShadowEmpty=$('#page_shadow_empty');
    /*$pageShadowEmpty=$('#page_shadow_empty').on('click',function(e){
        if($('.pp_confirm.to_show')[0]) return;
        if($('.pp_alert.to_show')[0])hideAlert();
    })*/

    //serverError();
    //showAlert('test test asydfk asdfasdf');
    //showConfirm('testasda sdfhjahs djfh ajsh dfhg ashd fjhasgdfj ghasdffasdfasdfasdfasdfasdftest');
    //showLayerBlockPage(true)
})

function onDragPage(){
    if (!('ontouchmove' in document)) {
        console.log('INIT PAGE DRAG');
        var swX, swY, swX0, swY0, $body=$('body');
        $win.on('mousemove',function(e){
            var dx=e.pageX-swX, dy=e.pageY-swY, sT=swY0-dy;
            if (movingWrap && !$body.is('.moving') && Math.abs(dx)>Math.abs(dy)) {
                movingWrap=0;
                $body.removeClass('hand');
            }
            if (movingWrap && sT != movingWrap.scrollTop()) {
                $body.addClass('moving');
                movingWrap.stop().animate({/*scrollLeft: swX0-dx,*/ scrollTop: sT}, 100)
            }
        }).on('mousedown',function(e){
            var targ=$(e.target);

            if (targ.is('.header, .header *, select, option, .page_shadow_empty, .layer_block_page, #header_menu, #header_menu *')) return;
            movingWrap=$('.main');
            //console.log(':',swX, swY, swX0, swY0, movingWrap[0].scrollHeight==movingWrap[0].clientHeight);
            //if (this.scrollHeight==this.clientHeight) return; For .main
            $body.addClass('hand');
            targ.add(targ.parents('a')).one('dragstart', function(){return !movingWrap});
            swX0=movingWrap.scrollLeft();
            swY0=movingWrap.scrollTop();
            swX=e.pageX;
            swY=e.pageY;
        }).on('mouseup',function(){
            if (movingWrap) setTimeout(function(){
                //try {document.getSelection().collapseToStart()} catch(e) {}
                $body.removeClass('moving hand');
                movingWrap=0
            }, 1)
        });//.on('click', '.moving a', function(e){e.preventDefault()})
    }
}

function commonInitPage(){
    $(function(){
        onDragPage();
        console.log('%cCOMMON INIT PAGE:','background: #fdbcc5',ajax_login_status);
        if(window.orientation){
            $win.on('orientationchange',resizeWindow);
        }else{
            $win.on('resize',resizeWindow);
        }
        resizeWindow();
        $doc.on('click', '.alert_wrapper, .popup_alert', closeAlert);
        prepareBlContentPage();
    })
}

function prepareBlContentPage(){
    if(!ajax_login_status)return;
    $('#content')[$('#footer')[0]?'removeClass':'addClass']('no_indent');
}

function clearBeforePageUpload(){
    if (ajax_login_status) {
        clProfile.curHash='';
        clProfile.resetLastPosAlbums();
    }
    $('body').off('click', '.photo_grant_access, .photo_deny_access, .go_to_albums').removeClass('fixFixed');
    $win.off('hashchange resize orientationchange beforeunload touchend mousemove mousedown mouseup pointerup');
    $doc.off('click');
    clearCacheJq();
    movingWrap=0;
}

function resizeWindow(){
    positionErrorOnResize();
}

function showLayerBlockPage(loader){
    if($layerBlockPage.is('.to_show'))return;
    var isL=defaultFunctionParamValue(loader,true);
    $layerBlockPage.removeClass('animated').addClass('to_show');
    $loaderLayerBlockPage.find('.css_loader').delay(100)[isL?'removeClass':'addClass']('hidden');
    if(isL){
        !$loaderLayerBlockPage.is('.show')&&$loaderLayerBlockPage.delay(1).toggleClass('show',0);
    }
}

function showLayerBlockPageNoLoader(){
    showLayerBlockPage(false);
}

function hideLayerBlockPage(){
    if(!$layerBlockPage.is('.to_show'))return;//||$layerBlockPage.is('.animated')
    //$layerBlockPage.addClass('animated');
    if($loaderLayerBlockPage.is('.show')){
        $layerBlockPage.addClass('animated');
        $loaderLayerBlockPage.removeClass('show');
        /*$loaderLayerBlockPage.oneTransEnd(function(){
            $loaderLayerBlockPage.find('.css_loader').addClass('hidden');
            $layerBlockPage.removeClass('to_show').removeClass('animated');
        }).removeClass('show');*/
        setTimeout(function(){
            if(!$layerBlockPage.is('.animated'))return;
            $loaderLayerBlockPage.find('.css_loader').addClass('hidden');
            $layerBlockPage.removeClass('to_show')
        },200)
    }else{
        $loaderLayerBlockPage.find('.css_loader').addClass('hidden');
        $layerBlockPage.removeClass('to_show');//.removeClass('animated');
    }
}

function getLoaderCl(ind,cl){
    getLoader(cl)
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
    if(!(notCache||0))cacheJq[key]=$loader;
    return $loader;
}

var pageHistory=[],pageHistoryReplace=false;
function clearHistoryPage(){
    pageHistory=[];
    pageHistoryReplace=false;
}

function setHistoryPage(){
    if(!setAjaxLoad)return;
    pageHistory.push(curPageData);
}

function updateHistoryPage(){
    if(!setAjaxLoad)return;
    if(window.history && history.replaceState){
        setHistoryPage()
        history.replaceState(pageHistory, curPageData.title, curPageData.url);
    }
}

function setPageTitle(title){
    $jq('title').text(title);
}
var curPageData={},isUploadPage=false;
function setPageData(title,description,keywords){
    var url=urlPageHistory,hash='',lHash=location.hash;
    console.log('%cSET DATA PAGE:','background: #fdbcc5',title,description,keywords,url,urlPageHistorySetHash,lHash);
    if(urlPageHistorySetHash){
        if(url.indexOf('profile_view')!==-1
            && clProfile.isHashLoadPage('profile_view',lHash)){
            hash=lHash;
        }else if(url.indexOf('search_results')!==-1
                    && clProfile.isHashLoadPage('search_results',lHash)){
            hash=lHash;
        }
        if(hash)url +=hash;
    }
    curPageData={title:title,url:url};
    if(!setAjaxLoad)return;
    if (pageHistoryReplace) {
        $jq('meta[name=description]').attr('content',description);
        $jq('meta[name=keywords]').attr('content',keywords);
        history.pushState(pageHistory, null, url);
    }else{
        history.pushState(pageHistory, null, url);
        pageHistoryReplace=true;
    }
    setPageTitle(title);
}

var fnErrorLoadPage = false;
function setErrorLoadPage(fn){
    if (typeof fn == 'function') {
        fnErrorLoadPage = fn;
    }else{
        fnErrorLoadPage = false;
    }
}

function callErrorLoadPage(){
    if (typeof fnErrorLoadPage == 'function') {
        fnErrorLoadPage();
    }
    fnErrorLoadPage = false;
}

/* History load function */
var fnErrorHistoryLoad = false;
function setErrorHistoryLoad(fn){
    if (typeof fn == 'function') {
        fnErrorHistoryLoad = fn;
    }else{
        fnErrorHistoryLoad = false;
    }
}

function callErrorHistoryLoad(){
    if (typeof fnErrorHistoryLoad == 'function') {
        fnErrorHistoryLoad();
    }
    fnErrorHistoryLoad = false;
}

var fnEndHistoryLoad = false;
function setEndHistoryLoad(fn){
    if (typeof fn == 'function') {
        fnEndHistoryLoad = fn;
    }else{
        fnEndHistoryLoad = false;
    }
}

function callEndHistoryLoad(){
    if (typeof fnEndHistoryLoad == 'function') {
        fnEndHistoryLoad();
    }
    fnEndHistoryLoad = false;
}
/* History load function */

function uploadPageError($link){
    hideLayerBlockPage();
    if($link[0]){
        if (ajax_login_status) {
            updateStart=true;
        }
        $link.removeLoader();
    }
    callErrorLoadPage();
    callErrorHistoryLoad();
    serverError();
    setTimeout(function(){isUploadPage=false},100);
}

function uploadPage($link,url,back){
    $link=$link||[];
    back=back||0;
    $.ajax({url:url,
        type:'POST',
        data:{upload_page_content_ajax:1},
        beforeSend: function(){
        },
        success: function(res){
            res=checkDataAjax(res);
            if(res===false){
                uploadPageError($link);
                return;
            }
            var $dataRes=$(res);
            if ($dataRes[0]) {
                callEndHistoryLoad();
                closeAlert();
                $jq('#main').animate({scrollTop:0},300,function(){
                    if(!back)updateHistoryPage();
                    replaceScriptPage($dataRes);
                    var $data=$dataRes.find('.page_content_inner'),
                        $pC=$jq('#page_content');
                    if(back){
                        $pC.addClass('target move_to_left');
                        $pC.prepend($data).oneTransEnd(function(){
                            $pC.find('.page_content_inner:last').remove();
                            hideLayerBlockPage();
                        }).toggleClass('target move_to_left',0);
                    }else{
                        $pC.removeClass('target').append($data).oneTransEnd(function(){
                            $pC.find('.page_content_inner:first').remove();
                            $pC.toggleClass('target move_to_left');
                            hideLayerBlockPage();
                        }).toggleClass('move_to_left');
                    }
                })
                isUploadPage=false;
            }else{
                if (typeof res == 'object' && res.redirect) {
                    console.log('REDIRECT', res.redirect);
                    redirectUrl(res.redirect);
                }else{
                    uploadPageError($link);
                }
            }
        },
        error: function(){
            uploadPageError($link);
        },
        complete: function(){
        }
    })
}

function replacePageMemberMenu($data){
    var $curMenu=$jq('#header_menu_cont'),
        $dataMenu=$data.find('#header_menu_cont');
    if($curMenu[0].innerText.replace(/[\s{2,}]+/g, '')!=$dataMenu[0].innerText.replace(/[\s{2,}]+/g, '')){
       $curMenu.replaceWith($dataMenu);
       setTimeout(function(){$win.resize()},10);
    }
}

function uploadPageMember($link,url,back){
    $link=$link||[];
    back=back||0;
    //var time = performance.now();
    if($('.module_media_chat')[0])mediaChatClose();
    updateStart=false;
    $.ajax({url:url,
        type:'POST',
        data:{upload_page_content_ajax:1},
        context:document.body,
        beforeSend: function(){
        },
        success: function(res){
            res=checkDataAjax(res);
            if(res===false){
                uploadPageError($link);
                return;
            }
            var $data=$(res);
            if ($data[0]) {
                var $main=$data.find('.main');
                if($main[0]){
                    callEndHistoryLoad();
                    clearBeforePageUpload();
                    clCommon.initMenuResize();
                    var $body=$(this);
                    $body.find('textarea.autosizejs').remove();
                    !back&&setHistoryPage();
                    replaceScriptPage($data);

                    $body.find('#bl_header_action').replaceWith($data.find('#bl_header_action'));
                    $body.find('.main').replaceWith($main);

                    //console.timeEnd('goToPage');
                    //time = performance.now() - time;
                    //console.log('Page Ajax Time: '+time);
                    closeAlert();
                    setTimeout(function(){
                        prepareBlContentPage();
                        if(clCommon.isVisibleHeaderMenu()){
                            clCommon.showHeaderMenu(true,function(){
                                $link[0]&&$link.removeLoader();
                                replacePageMemberMenu($data);
                            })
                        }else{
                            $pageShadowEmpty.removeClass('show');
                            $link[0]&&$link.removeLoader();//NO????
                            replacePageMemberMenu($data);
                        }
                        hideLayerBlockPage();
                        $('.pp_shadow, .pp_wrapper').remove();
                        isUploadPage=false;
                    },250)
                }else{
                    if (typeof res == 'object' && res.redirect) {
                        console.log('REDIRECT', res.redirect);
                        redirectUrl(res.redirect);
                    }else{
                        uploadPageError($link);
                    }
                }
            }else{
                uploadPageError($link);
            }
        },
        error: function(){
            uploadPageError($link);
        },
        complete: function(){
        }
    })
}

function uploadHomePage(urlHome,fn){
    var fnError;
    if(typeof fn=='function')fnError=fn
    else fnError=serverError;
    showLayerBlockPageNoLoader();
    $.ajax({
        url:urlHome,
        type:'POST',
        data:{upload_page_content_ajax:1},
        context:document.body,
        beforeSend: function(){

        },
        success: function(res){
            res=checkDataAjax(res);
            responseHomePage(res,fnError);
        },
        error: fnError,
        complete: function(){
        }
    })
}

function responseHomePage(res,fnError){
    var $data=$(res), $main=$data.filter('#main_wrap');
    if($main[0]){
        pageHistory=[];
        clearBeforePageUpload();
        replaceScriptPage($data,true);
        var $body=$('body').toggleClass('body_visitor body_member');
        $('html').addClass('html_member');
        $body.find('#main_wrap').replaceWith($main);
        hideLayerBlockPage();
        var $srcSite=$data.find('.default_values');
        if($srcSite[0]){
            $body.find('.default_values').replaceWith($srcSite);
        }
    }else{
        if (typeof res == 'object' && res.redirect) {
            console.log('REDIRECT', res.redirect);
            redirectUrl(res.redirect);
        }else{
            hideLayerBlockPage();
            if(typeof fnError=='function')fnError();
        }
    }
}

function uploadPageIndex(){//logout
    updateStart=false;
    if($('.module_media_chat')[0])mediaChatClose();
    $.ajax({url:urlPagesSite.index+'?cmd=logout',
        type:'POST',
        data:{upload_page_content_ajax:1},
        context:document.body,
        beforeSend: function(){
        },
        success: function(res){
            res=checkDataAjax(res);
            var $data=$(res), $main=$data.filter('#main_wrap');
            closeAlert();
            if($main[0]){
                var $body=$(this);
                var fn=function(){
                    clearBeforePageUpload();
                    clearHistoryPage();
                    replaceScriptPage($data,true);
                    $body.toggleClass('body_member body_visitor');
                    $('html').removeClass('html_member');
                    $body.find('#main_wrap').replaceWith($main);
                    siteGuid=0;
                    isUploadPage=false;
                    hideLayerBlockPage();
                    $pageShadowEmpty.removeClass('show');
                }
                setTimeout(fn,300);
            }else{
                if (typeof res == 'object' && res.redirect) {
                    console.log('REDIRECT', res.redirect);
                }
                uploadPageError([]);
            }
        },
        error: function(){
            uploadPageError([]);
        },
        complete: function(){
        }
    })
}

function uploadPageUpgrade($link,param,loader){
    showLayerBlockPage(loader||false);
    $link=$link||[];
    param=param||'';
    uploadPageMember($link,urlPagesSite.upgrade+param);
}

function getPage($link,url,back,showLayerLoader){
    showLayerLoader=showLayerLoader||false;
    showLayerBlockPage(back||showLayerLoader);
    isUploadPage=true;
    if (ajax_login_status) {
        messages.clearChat();
        uploadPageMember($link,url,back);
    }else{
        uploadPage($link,url,back);
    }
}

function goToLogOut(){
    messages.clearChat();
    showLayerBlockPageNoLoader();
    $('.popup_alert:visible').find('.btn.violet').addLoader();
    uploadPageIndex();
}

function goToIndex(link){
    var url=location.href.split('#')[0];
    if(url.indexOf('index')!==-1)return;
    goToPage(link);
}

function isUpgradePage(){
    return activePage.indexOf('upgrade') !== -1 && !$jq('#type_service').val();
}

function checkAccessFeature(el,action){
    var $el=$(el), feature=action=='who_likes_you'?'encounters':'3d_city';
    if(userAllowedFeature[feature]==undefined)return;
    if(!userAllowedFeature[feature]){
        if(isUpgradePage()){
            if(clCommon.isVisibleHeaderMenu()){
                clCommon.showHeaderMenu(true,function(){
                    showAlert(l('please_upgrade_your_account'),false,'fa-info-circle')
                })
            }else{
                showAlert(l('please_upgrade_your_account'),false,'fa-info-circle');
            }
        }else{
            $el.addLoader();
            uploadPageUpgrade($el)
        }
        return;
    }else{
        if(in_array(action,['3d_city', 'street_chat'])){
            $el.addLoader();
            redirectUrl(el.href);
        }else{
            goToPage(el);
        }
    }
}

function goToPage(link, url){
    if (!ajax_login_status&&isUploadPage)return;
    url=url||false;
    var $link=$(link);
    if(!url){
        url=link.href?link.href:$link.data('url')
    }
    if(!url)return false;//проверить когда в адресе только url_main = ./ запретить
    //var curUrl=curPageData.url.split('#')[0];
    var curUrl=location.href.split('#')[0];
    console.log('Open Page:',curUrl,url,url.indexOf(curUrl)!==-1);
    if(url.indexOf(curUrl)!==-1&&curUrl==url){
        if(curUrl.indexOf('profile_view')!==-1&&location.hash=='#tabs-3'){
            clCommon.hideHeaderMenu(function(){clProfile.setProfileDefaultTabs()});
        }else{
            clCommon.hideHeaderMenu();
        }
        return false;
    };
    var layerLoader=$link.data('layerLoader')?true:false;
    if(!$link.data('notLoader')){
        $link.addLoader();
    }else{
        $link=[];
    }
    //setTimeout(function(){$link.removeLoader()},200)
    //return false;
    if ($link[0]&&$link.is('.no_load_ajax')){
        return true;
    }
    if($link[0]){
        if(!$link.is('.no_load_ajax'))getPage($link,url,false,layerLoader);
    }else{
        getPage($link,url,false,layerLoader);
    }
    return false;
}

function getDataScript(script){
    var $script=$(script),key,src,cache,lang;
    if(script.id){
        key=script.id;
        cache=$script.data('cache');
        lang=$script.data('lang');
    }else{
        src=script.src.split('?');
        key=src[0];
        cache=src[1];
        lang='';
    }
    return {key:key, el:$script, cache:cache, lang:lang};
}

function replaceScriptPage($data,login){
    //console.log('CASH VERSION',$doc.find('#main_wrap').data('cacheVersion'), $data.filter('#main_wrap').data('cacheVersion'));
    var $mainWrap=$doc.find('#main_wrap'),$resMainWrap=$data.filter('#main_wrap');
    if($mainWrap.data('cacheVersion')!=$resMainWrap.data('cacheVersion')
        ||$mainWrap.data('tmplActive')!=$resMainWrap.data('tmplActive')){
        redirectUrl($resMainWrap.data('urlPage'))
        return;
    }
    login=login||0;
    var styles={},script={},scriptCacheChanged={},$scr,key,srcData,loadScr;

    /* LOADED SCRIPT AND STYLE */
    $doc.find('script[src], script[id], link[rel=stylesheet], script[class="always_run_after_loading"]').each(function(){
        if (this.rel) {
            styles[this.href]=$(this);
        }else{
            if(this.src){
                srcData=getDataScript(this);
                script[srcData.key]=srcData;
            }else if(this.id || $(this).is('.always_run_after_loading')){
                if(this.id=='script_replace_one'){
                    return;
                }
                //console.log('%cSITE SCRIPT DELETE','background: #f15d75', this.id, this);
                $(this).remove();
            }
        }
    })
    var $siteFavIcon=$doc.find('link[type="image/x-icon"]'),
        $updateFavIcon=$data.filter('link[type="image/x-icon"]'),
        $updateFavIconHref=$updateFavIcon[0].href;

    $data.filter('link[rel=stylesheet], script[src], script[id], script[class="always_run_after_loading"]')
         .add($data.find('script[src], script[id], script[class="always_run_after_loading"]'))
    .each(function(){
        if (this.rel) {
            if(styles[this.href]){
                delete styles[this.href];
            }else{
                //console.log('%cSTYLE ADD:','background: #c0dafb',this.href);
                $(this).appendTo('head');
            }
        }else{
            $scr=$(this);
            if($scr.is('.always_run_after_loading')){
                //console.log('%cSCRIPT SRC LOADED: .always_run_after_loading','background: #afb468',this.src);
                $scr.appendTo('head');
            } else if(this.src){
                srcData=getDataScript(this);
                loadScr=script[srcData.key];
                if(loadScr){
                    if (srcData.cache==loadScr.cache&&srcData.lang==loadScr.lang) {
                        //console.log('%cSCRIPT SRC LOADED:','background: #afb468',this.src);
                        delete script[srcData.key];
                    }else{
                        if(this.src.indexOf('jquery-1.11.2.min.js')!==-1){
                            $(window).off('popstate');
                            $('#main_wrap').off('touchmove');
                            $('body').off('click');
                            //console.log('%cSCRIPT CLEAR VALUE:','background: #40c7db');
                        }
                        //console.log('%cSCRIPT DELETE CHANGE CACHE','background: #f15d75',loadScr.key,loadScr.cache);
                        loadScr.el.remove();

                        scriptCacheChanged[srcData.key]=loadScr.el;
                        //console.log('%cSCRIPT SRC CHANGE CACHE ADD:','background: #c0dafb',srcData.key,srcData.cache);
                        $scr.appendTo('head');
                    }
                } else {
                    //console.log('%cSCRIPT SRC ADD:','background: #c0dafb',this.src);
                    $scr.appendTo('head');
                }
            }else if(this.id){
                if(this.id=='script_replace_one'){
                    if(login){
                        //console.log('%cSCRIPT ID ADD:','background: #c0dafb',this.id);
                        $(this).appendTo('head');
                    }
                    return;
                }else if(this.id=='script_replace_footer'){
                    if(isCriOS){
                        var $scF=$(this);
                        setTimeout(function(){
                            $scF.appendTo('head');
                            $siteFavIcon[0].href=$updateFavIconHref;
                        },800)
                    }else{
                        $(this).appendTo('head');
                    }
                }else{
                    $(this).appendTo('head');
                }
                //console.log('%cSCRIPT ID ADD:','background: #c0dafb',this.id);
            }
        }
    })
    if(login){
        for (var key in script) {
            //console.log('%cSCRIPT DELETE NOT NEEDED','background: #f15d75',key);
            script[key]['el'].remove();
        }
    }
    if(!$.isEmptyObject(styles)){
        setTimeout(function(){
            for (var key in styles) {
                //console.log('%cSTYLE DELETE NOT NEEDED','background: #f15d75',key);
                styles[key].remove();
            }
        },500)
    }
    /* STYLE */
    var $siteColorScheme=$doc.find('style[id=style_color_scheme]'),
        $updateColorScheme=$data.filter('style[id=style_color_scheme]');
    if($siteColorScheme.data('cache')!=$updateColorScheme.data('cache')||login){
        //console.log('%cCOLOR SCHEME REPLACE','background: #f15d75');
        $jq('meta[name=theme-color]').attr('content',$data.filter('meta[name=theme-color]').attr('content'));
        $siteColorScheme.remove();
        $updateColorScheme.appendTo('head');
    }
    /* STYLE */
    /* LOGO */
    if($siteFavIcon[0].href!=$updateFavIconHref){
        $siteFavIcon[0].href=$updateFavIconHref;
    }
    if(!ajax_login_status){
        var $siteLogo=$doc.find('#img_logo');
        if($siteLogo[0]){
            $siteLogoSrc=$siteLogo[0].src,
            $upadeLogo=$data.find('#img_logo'),
            $upadeLogoSrc=$upadeLogo[0].src;
            if($siteLogoSrc!=$upadeLogoSrc){
                $siteLogo[0].src=$upadeLogoSrc;
                $siteLogo.attr('style', $upadeLogo.attr('style'))
            }
        }
    }
    /* LOGO */
    initStyle();
}

/* ALERT */
function serverError(){
    showAlert(l('server_error_try_again'),false,'fa-info-circle');
}

function showConfirmUserPhoto(data, msg, handler, hCancel, btnOk, btnCancel, onlyOk, notClose){
    var photoHtml = '<div class="pic pp_msg_pic">'+
                        '<button style="background-image: url('+urlFiles+data.photo+');"></button>'+
                    '</div>';
    msg=msg.replace(/{user_photo}/,photoHtml).replace(/{user_name}/,data.user_name);
    showConfirm(msg, handler, hCancel, btnOk, btnCancel, onlyOk, false, true, false);
}

function showConfirm(msg, handler, hCancel, btnOk, btnCancel, onlyOk, notClose, alingCenter, fa){
    msg=msg||l('are_you_sure');
    closeAlert();
    btnOk=btnOk||l('alert_html_ok');
    btnCancel=btnCancel||l('cancel');
    var iconHtml='';
    if(fa!==false){
        fa=fa||'fa-question-circle';
        iconHtml='<span class="icon"><i class="fa '+fa+' aria-hidden="true"></i></span>';
    }
    var html='<div class="popup_alert popup pp_confirm question">'+
                '<div class="cont_pp">'+
                    '<span class="txt flex">'+
                        iconHtml+
                        '<span class="cont_pp_msg"><span class="msg_cont">'+msg+'</span></span>'+
                    '</span>'+
                    '<div class="dubl_btn">'+
                        '<button class="btn large navyblue l pp_btn_cancel_bl"></button>'+
                        '<button class="btn large violet r pp_btn_ok_bl"><span class="pp_btn_ok"></span></button>'+
                    '</div>'+
                    '<div class="cl"></div>'+
                '</div>'+
              '</div>';
    var $pp=$(html);
    $('.pp_btn_ok', $pp).html(btnOk)
    $('.violet', $pp).one('click',function(){
        if(typeof handler==='function')handler($(this));
        if(!(notClose||0))closeAlert();
        return false;
    });
    if (onlyOk||0) {
        $('.dubl_btn', $pp).addClass('one');
    } else {
        $('.navyblue', $pp).html(btnCancel).one('click',function(){
            if(typeof hCancel==='function')hCancel();
            closeAlert();
            return false;
        })
    }
    //$('.cont_pp_msg', $pp)[alingCenter?'addClass':'removeClass']('center');
    var pic=$pp.find('.pp_msg_pic')[0];
    if(pic){
        $pp.find('.cont_pp_msg').addClass('center');
        $pp.find('.txt').removeClass('flex').find('.icon').remove();
    }
    setTimeout(function(){
        if(!pic){
            var $msgCont=$pp.find('.msg_cont');
            var $contPp=$pp.find('.cont_pp_msg').width($msgCont.width()+1);

            var $txt=$pp.find('.txt'),
                h=$txt[0].offsetHeight/parseInt($txt.css('line-height'));
            if(h>=4){
                $contPp.removeAttr('style');
                $txt.find('.icon').remove();
                $txt.addClass('txt_big');
            }
        }
    },1)

    return $pp.modalPopup({wrClass: 'alert_wrapper',css:{},wrCss:{zIndex:1001}}).open()
}
function showConfirmToPage(msg, url, btnOk, onlyOk){
    onlyOk=defaultFunctionParamValue(onlyOk,true);
    showConfirm(msg, function(){
        goToPage($('.pp_btn_ok_bl:visible').data('url',url));
    }, false, btnOk, '', onlyOk, true);
}

var showAlert = showAlertAppear = function(msg,fnClose,fa){
    closeAlert();
    msg=msg||l('alert_success');
    fa=fa||'fa-thumbs-up';
    var $pp=showConfirm(msg, fnClose, false, false, false, true, false, false, fa);
    $doc.one('click', '.alert_wrapper', function(){
        $pp.find('.pp_btn_ok_bl').click()
    })
}

function showAlertDelayShow(msg,d,notClose){
    setTimeout(function(){
        if(notClose||0){
            showAlertAppear(msg)
        }else{
            showAlertAppearDelayClose(msg)
        }
    },d||200)
}

function showAlertAppearDelayClose(msg,d){
    showAlertAppear(msg);
    setTimeout(closeAlert,d||2500)
}

function showAlertExecFnClose(msg,fn,d){
    showAlert(msg,fn);
    setTimeout(function(){
        closeAlert();
        if(typeof fn=='function')fn()
    },d||2000)
}

function closeAlert(e) {
    if(e&&$(e.target).is('.alert_wrapper')&&$('.pp_confirm:visible').last()[0]){
        return false
    }
	if ((e&&e.target==this)||!e){
        var el=$('.popup_alert:visible').last();
        el.close('', 0, !el.data('no_remove'));
        return false
    }
}
/* ALERT */
/* ERROR */
function showError(el,msg,vis,within,wr,d,of){
    msg=msg||'';
    vis=defaultFunctionParamValue(vis,1);
    wr=wr||el.closest('.bl');
    var of=el,elOf=el.data('of');
    if(elOf)of=el.closest(elOf);
    within=within||'#main';
    d=d||'-18';
    var html,id=el[0].id,tip=$('#tip_'+id);

    if(!tip[0]){
        html = '<div id="tip_'+id+'" class="custom_tooltip tooltip pink">'+
                    '<div class="icon">'+msg+'</div>'+
                    '<div class="decor"></div>'+
                '</div>';
        tip=$(html).hide().appendTo(wr);
    }else if(msg){
        tip.find('.icon').html(msg);
    }
    tip.data({within:within}).css('left',0);
    el.addClass('wrong');
    if(vis){
        var at='center top'+d;
        tip.stop().fadeIn({step:function(){showArrow(tip,el)}}).position({my:'center bottom', at:at, of:of, within:within});
    }
}

function showArrow(tip,el){
    tip[tip.position().top>0?'addClass':'removeClass']('top')
}

function showErrorFrm(el,msg,vis){
    showError(el,msg,vis,'.cont_wrap',false)
}

function showErrorWrongFrm(el){
    if (el.is('.wrong')) {
        showError(el,false,true,'.cont_wrap');
    }
}

function showErrorWrongEl(el){
    if (el.is('.wrong')) {
        showError(el);
    }
}

function hideError(el,isRemove){
    if(!el[0])return;
    var $tip=$('#tip_'+el[0].id);
    if($tip[0]){
        $tip.stop().fadeOut(1,function(){
            if(isRemove){
                $(this).remove()
            }
        })
    }
}

function hideErrorEl($el,isRemove){
    if($el[0]){
        $el.stop().fadeOut(1,function(){
            if(isRemove){
                $el.closest('.wrong').removeClass('wrong');
                $el.siblings('.wrong').removeClass('wrong');
                $el.remove()
            }
        })
    }
}

function resetError(el){
    if (el.is('.wrong')) {
        hideError(el,1);
        el.removeClass('wrong');
    }
}

function resetAllError(){
    var $tip=$('.custom_tooltip');
    if($tip[0]){
        $tip.each(function(){
            hideErrorEl($(this),1)
        })
    }
}

function positionErrorOnResize(){
    var $tip=$('.custom_tooltip:visible');
    if($tip[0]){
        var $el=$('#'+$tip[0].id.replace(/tip_/,''));
        if($el[0]){
            var of=$el,elOf=$el.data('of');
            if(elOf)of=$el.closest(elOf);
            $tip.css('left',0);
            $tip.position({my:'center bottom', at:'center top-18', of:of, within:$tip.data('within')});
            showArrow($tip,$el);
        }
    }
}
/* ERROR */

function getTimeSrollToMain(top, mTop, d){
    mTop=defaultFunctionParamValue(mTop, 0);
    d=d||30;
    var t=Math.round(Math.sqrt(Math.abs(mTop-top))*d);
    if(t<250){t=250} else if(t>800)t=800;
    return t;
}

function scrollMainTo(fn,mTop,top,d){
    d=d||20;
    fn=fn||function(){};
    var $main=$jq('#main');
    mTop=defaultFunctionParamValue(mTop, $main.scrollTop());
    top=top||0;
    var t=Math.round(Math.sqrt(Math.abs(mTop-top))*d);
    if(t<250){t=250} else if(t>800)t=800;
    $main.stop().animate({scrollTop:top},getTimeSrollToMain(top, mTop, d),'easeInOutCubic',fn)
}


$.fn.addLoader = function(){
    var $btn=$(this);
    if($btn.is('.color_t')||$btn.is('.color_fade'))return;
    var clLoader=$btn.data('clLoader');
    if(!clLoader)clLoader='btn_action_loader';
    var typeLoader=$btn.data('typeLoader');
    if(typeLoader=='fade_btn'){
        $btn.addClass('color_fade').append(getLoader(clLoader,true,true).delay(1).removeClass('hidden',0));
        if($btn.data('clChildren')){
            $btn.find($btn.data('clChildren')).siblings().stop().fadeTo(200,0);
        }else{
            $btn.children('button').stop().fadeTo(300,.4);
            $btn.children(':not(.css_loader):not(button)').stop().fadeTo(200,0);
        }
    }else{
        $btn.addClass('color_t').append(getLoader(clLoader,false,true));
    }
    return $btn;
}

$.fn.removeLoader = function(){
    var $btn=$(this);
    if($btn.is('.color_t')||$btn.is('.color_fade')){
        if($btn.is('.color_fade')){
            if($btn.data('clChildren')){
                var is=true;
                $btn.find($btn.data('clChildren')).siblings().each(function(){
                    var $el=$(this);
                    if($el.is('.count')&&!($el.find('span').text()*1)){
                        $el.removeAttr('style');
                    }else{
                        $el.stop().fadeTo(200,1,function(){
                            if(is){
                                $btn.find('.css_loader').remove();
                                $btn.removeClass('color_fade');
                                is=false;
                            }
                        })
                    }
                })
            }else{
                $btn.children(':not(.css_loader)').stop().fadeTo(200,1,function(){
                    $btn.find('.css_loader').remove();
                    $btn.removeClass('color_fade');
                })
            }
            $btn.find('.css_loader').oneTransEnd(function(){
                $(this).remove();
            }).removeClass('hidden');
        }else{
            $btn.find('.css_loader').remove();
            $btn.removeClass('color_t');
        }
    }
    return $btn;
}

function vibrate(val){
    if('vibrate' in navigator)  return navigator.vibrate(val);
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
            //".message_one_cont{height:", (vh-107), "px;}",
            ".calc_vh{height:", vh, "px;}",
            ".bl_one_photo{height:", (vh-49), "px;}"
            ].join("");
        }
    fn();
    $win.on(getEventOrientation(), function(){setTimeout(fn,getTimeOrientation())});
}

function appPreloaderShow()
{
    $('.page-preloader').show();
    // logo to center of page
    $('.header-loader-logo').css('margin-left', '-' + ($('.header-loader-logo').width() / 2) + 'px');
    $('.header-loader-logo').css('margin-top', '-' + (100 + $('.header-loader-logo').height()) + 'px');
    $('.main_wrap').hide();
}

function updateCounter(el,count,isNew,forceUpdate, $el){
    $el=$el||$('.counter_'+el);
    //console.log($el);
    if(!$el[0])return;
    isNew = parseInt(isNew || 0);
    var val=$el.eq(0).find('span').text()*1;
    forceUpdate = forceUpdate || 0;
    if(val!=count || forceUpdate){
        if(parseInt(count) === 0) {
            count = '';
            isNew = 0;
        }
        if (count) {
            $el.find('span').text(count).end().addClass('to_show');
        }else{
            $el.removeClass('to_show').find('span').text('');
        }
        $el.closest('.count')[isNew?'addClass':'removeClass']('new');
    }
}

function updateMenuCounterAll(data){
    for (var el in data) {
        var newC=0,forceUpdate=0,count=data[el]['count']*1;
        if(data[el]['new'])newC=data[el]['new'];
        if(data[el]['update'])forceUpdate=data[el]['update'];
        //console.log('UPDATE COUNTER:',el,data[el]['count']*1, newC,forceUpdate);
        if (el=='messages') {
            messages.setNumberMessages(data[el]['info_im']['count']*1, data[el]['info_im']['uid']*1, data[el]['info_im']['message'])
            mobileAppCityNotification(data[el]['info_city']);
        }else if(el=='profile_visitors'){
            updateCounter(el,count,newC,0);
            updateCounter(el,data[el]['new']*1,newC,0,$('.counter_profile_visitors_header'));
        }else{
            updateCounter(el,count,newC,forceUpdate)
        }
    }
}

showLoadPhoto=function($img){
    $img.removeClass('to_hide').closest('li').removeClass('sliding');
    $('.loader_search_list.show').removeClass('show');
}