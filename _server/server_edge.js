var timeout,
    timeoutSec=10000,
    updateStart=false,
    timeoutSec=10000,
    timeoutSecServer=timeoutSec/1000*1.5,
    url_server='_server/update_server_ajax_edge.php',
    requestUserId=0,
    isFbModeTitle='false',
    isVisiblePage=true,
    users_list={},

    isVisibleMessages=false,
    last_id=0,
    lastNewMsgId=0,
    status_writing={},
    set_is_read_msg={},
    blink=[],
    isCityLoad,
    limitStart=0;

function updateServer(){
    if(!updateStart)return;
    /*
    var data={
                user_to:userTo,
                set_is_read_msg:msg_read,
                is_mode_fb:isFbModeTitle,

                city_counter_street_chat: $('#narrow_street_chat_count').length,
                city_counter_games: $('#column_narrow_game_choose_count').length,
                city_counter: $('#narrow_city_count').length,
                hide_im_on_page_city:isSiteOptionActive('hide_im_on_page_city')*1
              };

        */
    prepareStatusWritingIm(status_writing);

    var dataPost={
        page:currentPage,
        request_user_id:requestUserId,
        user_current:clMessages.userTo,
        users_list:JSON.stringify(users_list),
        status_writing:JSON.stringify(status_writing),
        get_read_msg_from_im:clMessages.getReadMsgFromIm(),
        is_mode_fb:isFbModeTitle,
        is_visible_messages:clMessages.isVisible(),
        last_id:last_id,
        friends_notification:0,
        get_list_friends:clFriends.isGetListFriends(),//Friends are updated only their
        location:0,
        event_first_date:clEvents.getFirstEventDate(),
        geo_position:geoPoint,
        timeout_server:timeoutSecServer
    };

    if (isLoadCity()) {
        dataPost.location=city.idChangeLoc;
    }
    var $friendsNotification=$('.friends_notification_item:first');
    if ($friendsNotification[0]) {
        dataPost.friends_notification=$friendsNotification.data('created');
    }
    $.post(url_server+'?cmd=update_im', dataPost,
        function(res){
            var data=$.trim(checkDataAjax(res));
            if (data!==false) {
                debugLog('Server: updateServer:', dataPost, '#f8e1b7');
                var $data=$(data);
                clMessages.updateServer($data.filter('div.update_msg_im'));
                $data.filter('div.script').appendTo('#update_server');
            }
        }
    );

    clearTimeout(timeout);
    timeout=setTimeout('updateServer()', timeoutSec);
}

function initServer(){
    if(!ajax_login_status)return;
    if(currentPage=='email_not_confirmed.php')return;
    updateStart=true;
    timeout=setTimeout('updateServer()', timeoutSec);
}

function isLoadCity(){
    return currentPage == 'city.php' && typeof city == 'object' && city.isSceneLoaded;
}

$(function(){
    if(isIos||isAppAndroid)return;
    var
    fnFocus = function(){
        if (ajax_login_status && currentPage!='email_not_confirmed.php') {
            localStorage.setItem('is_fb_mode', 'false');
            isFbModeTitle = 'false';
            localStorage.removeItem('is_title');
            localStorage.setItem('is_title', 'true');
            //document.title = siteTitle;
            $('title').text(siteTitle);
            isVisiblePage = true;
            if(clMessages.isVisible()){
                $.post(url_server+'?cmd=read_msg',{user_current:clMessages.userTo,is_mode_fb:'false'});
            }
            if (isLoadCity() && city.mainChatPanel && city.mainChatPanel.is('.is_open')) {
                city.setMessagesUserRead();
            }
            //resetHashMedia();
        }
    },
    fnBlur = function(){
        if (ajax_login_status && currentPage!='email_not_confirmed.php') {
            localStorage.setItem('is_fb_mode', 'true');
            isFbModeTitle = 'true';
            isVisiblePage = false;
            var data={cmd:'set_event_window'};
            if (isLoadCity()) {
                data['location']=city.idChangeLoc;
            }
            $.post(url_server,data);
        }
    }
    if(!visibilityChange(fnFocus, fnBlur)){
        $.winFocus({
            blur: fnBlur,
            focus: fnFocus
        })
    }

    $(window).on('storage', function(e) {
        var event = e.originalEvent;
        if (event.key === 'is_title') {
            $('title').text(siteTitle);
        } else if (event.key === 'is_fb_mode') {
            isFbModeTitle = event.newValue;
        } else if (event.key === 'title_site_counter') {
            $('title').text(event.newValue+' '+siteTitle);
        }
    });
});