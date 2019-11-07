// bg video
var pageBackgroundVideoPlayer, isBgVideoMute = false,
    bgVideoVolume = 10, bgVideoOnce = false,
    isYError = false, videoPrev = {},
    isVideoBgPageLoads = false, isDestroyPageBackgroundVideoPlayer = false;

$(function () {
    /*var fnShowDropLang=function($el){
        if($el.is(':animated'))return;
        $el.css('left', ($el.prev('.language').width() + 11)+'px').stop().animate({height:'toggle'},300);
    }
    $('#main_page_language').click(function(){
        var item=$(this).find('#main_page_language_item');
        fnShowDropLang(item);
    }).find('#main_page_language_item').mouseleave(function(){
        var item=$(this);
        if(!item.is(':visible'))return;
        fnShowDropLang(item);
    })*/


    $doc.on('click', function(e){
        var $targ=$(e.target),$langDrop=$('#main_page_language_item');
        if($targ.is('#main_page_language')||$targ.closest('#main_page_language')[0])return;
        if($langDrop.is(':animated')||!$langDrop.is(':visible'))return;
        //fnShowDropLang($langDrop);
    })

    $('.select_main').styler({
        singleSelectzIndex: '11',
        selectAutoWidth: false,
        selectAnimation: true,
        selectAppearsNativeToIOS: false,
        onFormStyled: function(){
            $jq('.bl_form_index').addClass('to_show');
            //$jq('.bl_location').addClass('to_show');
        }
    })

})

function prepareLang(){
    var $linkLang=$('#main_page_language .language');
    if ($linkLang[0]) {
        var notShowLang=false;
        $('#pp_language').autocolumnlist({columns: getSiteOption('number_of_columns_in_language_selector'), clickEmpty:function(){
            notShowLang=true;
            $('#main_page_language_item').stop().animate({height: 'toggle'}, 300, function(){
                setTimeout(function(){notShowLang=false},100);
            });
        }});
        var w=$linkLang.width();
        $('.main_page_language_bl').width(w);
        $linkLang.css({backgroundPosition:(w+5)+'px 8px',opacity:1}).width(w);
        if($('#fl_right_sign_in')[0])$('#fl_right_sign_in').css({opacity:1})
        $('#main_page_language').hover(function (){
            if(notShowLang)return;
            $(this).find('#main_page_language_item').stop().animate({height: 'toggle'}, 300);
        })
    }else if($('#fl_right_sign_in')[0]){
        $('#fl_right_sign_in').addClass('no_lang')
    }
}

function goToIndexForLogo(){
    var $logo=$('#logo_main_page');
    if(activePage=='index.php'){
        $logo.css({cursor:'default'})
    }else{
        $logo.click(function(){
            redirectUrl(urlPagesSite.index);
        })
    }
}

function pageBackgroundVideo() {

    var video = user_profile_bg_video;

    pageBackgroundVideoShow();

    if (pageBackgroundVideoPlayer) {
        $('#bg_video').fadeOut(0, function () {
            pageBackgroundVideoPlayer.stopVideo();
            if (video[1]) {
                pageBackgroundVideoPlayer.loadVideoById(video[0]);
                pageBackgroundVideoPlayer.setPlaybackQuality(profile_bg_video_quality);
            }
        })
    } else if (video[1]) {
        pageBackgroundVideoPlayer = $.getScript('https://www.youtube.com/iframe_api')
    }
}

function onYouTubeIframeAPIReady() {
    var video = user_profile_bg_video;
    $('#bg_video').show()[0];
    pageBackgroundVideoPlayer = new YT.Player('bg_video', {
        videoId: video[0],
        playerVars: {
            showinfo: 0,
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            theme: 'light',
            wmode: 'opaque'
        }, events: {
            onReady: function (e) {
                pageBackgroundVideoPlayer.setPlaybackQuality(profile_bg_video_quality);
                if (isBgVideoMute && bgVideoVolume) {
                    pageBackgroundVideoPlayer.setVolume(bgVideoVolume)
                } else {
                    pageBackgroundVideoPlayer.mute()
                }
            },
            onStateChange: function (e) {
                if (e.data * 1 === 0 && bgVideoOnce) {
                    $('#bg_video').hide(1, function () {
                        pageBackgroundVideoPlayer.destroy()
                    })
                    return;
                }
                if (isBgVideoMute && bgVideoVolume) {
                    pageBackgroundVideoPlayer.setVolume(bgVideoVolume)
                } else if (!pageBackgroundVideoPlayer.isMuted()) {
                    pageBackgroundVideoPlayer.mute()
                }
                //e.data = -1 / Error
                if (e.data * 1 === 1) {
                    isVideoBgPageLoads = false;
                    $('#bg_video').stop().fadeTo(1, 1);

                    videoPrev = $.extend({}, user_profile_bg_video);
                }
                if (e.data * 1 === 0 && !bgVideoOnce) {
                    pageBackgroundVideoPlayer.playVideo();
                }
                if (e.data == -1) {
                    destroyPageBackgroundVideoPlayer();
                }
            },
            onError: function (e) {
                pageBackgroundVideoPlayer.mute();
                isYError = true;

                if (videoPrev[1]) {
                    user_profile_bg_video = videoPrev;
                    pageBackgroundVideo();
                } else {
                    destroyPageBackgroundVideoPlayer();
                }
                /*}else if (!Profile.isMyProfile()) {
                    destroyPageBackgroundVideoPlayer();
                } else {
                    $('.bg_video.tumb:visible').fadeOut(400);
                    pageBackgroundVideoPlayer.stopVideo();
                }*/
            }
        }
    });
}

function destroyPageBackgroundVideoPlayer() {
    if (isDestroyPageBackgroundVideoPlayer)
        return;
    isDestroyPageBackgroundVideoPlayer = true;
    user_profile_bg_video = {};
    $('.bg_video.tumb:visible').fadeTo(600, 0, function () {

    });
    $('#bg_video').hide(1, function () {
        pageBackgroundVideoPlayer.destroy()
    })
}

function pageBackgroundVideoShow() {

    var video = user_profile_bg_video, path = 'https://i.ytimg.com/vi/' + video[0];
    var timestampAtFunctionStart = new Date * 1;

    function insRes(url) {

        var prev = $('.bg_video.tumb'), cur = $(prev[0]);
        if (url) {

            videoPlayerOnPageResize();

            //timerEnd = new Date() * 1;
            //console.log('timer', timerEnd - timerStart);

            cur.clone().addClass('cloned').css({backgroundImage: 'url(' + url + ')'})
                .insertAfter(prev.last()).stop().fadeTo(1, 1).oneTransEnd(function () {
                prev.remove();
                //$('html').css({background:''});
            }).add('#bg_video');

        } else {
            prev.fadeTo(0, 0);
        }
        bgLast = [url, cur.width(), ''];
        name = bgLast.join(',');
    }

    if (video[1] && (!bgLast[0] || bgLast[0].search(video[0] < 0))) {
        $('<img />').load(function () {
            var img = this;

            if (img.width > 400 || img.src == path + '/hqdefault.jpg') {

                insRes(img.src);
                return;
            }
            setTimeout(function () {
                img.src = path + '/hqdefault.jpg'
            }, Math.max(1, 100 - (new Date * 1) + timestampAtFunctionStart));
        }).error(function () { console.log('load image error'); })[0].src = path + '/maxresdefault.jpg';
    } else {
        insRes(video[1] ? bgLast[0] : 0);
    }
}

function videoPlayerOnPageResize()
{
    var video = user_profile_bg_video;
    var videoSize = centerItemInAreaByHeightWithCrop(video['width'], video['height'], $('.header').width(), $('.header').height());
    $('#bg_video, #bg_video_tumb').css({width: videoSize['width'], height: videoSize['height'], left: videoSize['horizontalGap']});
}

$win.on('resize', function () {
    if (typeof user_profile_bg_video!='object' || !user_profile_bg_video[1]) {
        return;
    }
    videoPlayerOnPageResize();
}).on('beforeunload', function () {
    if (pageBackgroundVideoPlayer) {
        pageBackgroundVideoPlayer.mute();
    }
    $('#bg_video').stop().fadeOut(500);
});

function pageBackgroundVideoInit() {

    if(profile_bg_video_play_disabled) {
        pageBackgroundVideoShow()
        return;
    }

    if (user_profile_bg_video[1]) {
        isVideoBgPageLoads = true;
        pageBackgroundVideo();
    }
}