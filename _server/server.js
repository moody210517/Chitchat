var timeout,
    last_id=0,
    lastNewMsgId=0,
    lastGift=0,
    updateStart=false,
    isVisibleMessages=false,
    isFbModeTitle='false',
    isVisiblePage=true,
    status_writing={},
    blink=[],
    users_list={},
    timeoutSec=10000,
    timeoutSecServer=timeoutSec/1000*1.5,
    userTo=0,
    requestUserId=0,
    isUserBroadcost=0,
    isCityLoad,
    getReadMsgFromIm=0;

function updateServer(){
    if(updateStart){
        prepareStatusWritingIm();

        getReadMsgFromIm=0;
        if(isVisibleMessages){
            if ($('#pp_message_list_message_'+Messages.userTo).find('.msg_check[data-msg-uid='+siteGuid+']:hidden')[0]) {
                getReadMsgFromIm=1;
            }
        }
        //console.log('AJAX:',getReadMsgFromIm);
        var data={cmd:'update_im',
                  users_list:JSON.stringify(users_list),
                  user_current:Messages.userTo,
                  counter_all:Messages.counter_all,
                  is_visible_messages:isVisibleMessages,
                  is_visible_page:isVisiblePage,
                  last_id:last_id,
                  last_new_msg_id:lastNewMsgId,
                  status_writing:JSON.stringify(status_writing),
                  get_read_msg_from_im:getReadMsgFromIm,
                  is_mode_fb:isFbModeTitle,
                  timeout_server:timeoutSecServer,
                  page:currentPage,
                  last_gift:Gifts.lastGift,
                  //spotlight_items:Profile.spotlightItems,
                  request_user_id:requestUserId,
                  is_user_broadcost:isUserBroadcost,
                  geo_position:geoPoint
            };

        if (isLoadCity()) {
            data['location']=city.idChangeLoc;
        }
        $.post(url_server, data,
                function(res){
                    var data=$.trim(checkDataAjax(res));
                    if (data!==false) {
                        $(data).appendTo('#update_server');
                }
        });
    }
    clearTimeout(timeout);
    timeout=setTimeout('updateServer()', timeoutSec);
}

function initServer(){
    if(!ajax_login_status)return;
    updateStart=true;
    timeout=setTimeout('updateServer()', timeoutSec);
}

function isLoadCity(){
    return activePage == 'city.php' && typeof city == 'object' && city.isSceneLoaded;
}

$(function(){
    $.winFocus({
        blur: function(e) {
            if (ajax_login_status) {
                localStorage.setItem('is_fb_mode', 'true');
                isFbModeTitle = 'true';
                isVisiblePage = false;
                var data={cmd:'set_event_window'};
                if (isLoadCity()) {
                    data['location']=city.idChangeLoc;
                }
                $.post(url_server,data);
            }
        },
        focus: function(e) {
            if (ajax_login_status) {
                localStorage.setItem('is_fb_mode', 'false');
                isFbModeTitle = 'false';
                localStorage.removeItem('is_title');
                localStorage.setItem('is_title', 'true');
                document.title = siteTitle;
                isVisiblePage = true;
                if(isVisibleMessages){
                    //Messages.counter_all=0;
                    $.post(url_server+'?cmd=read_msg',{user_current:Messages.userTo,is_mode_fb:'false'});
                }
                if (isLoadCity() && city.mainChatPanel.is('.is_open')) {
                    city.setMessagesUserRead();
                }
            }
        }
    });
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