var timeout,
    last_id=0,
    updateStart=false,
    isFbMode='false',
    isFirstLoad=true,
    status_writing=0,
    blink=[],
    users_list={},
    timeoutSec=10000,
    timeoutSecServer=timeoutSec/1000*1.5,
    userTo=0,
    limitStart=0,
    requestUserId=0,
    isOneChat='',
    users_list_general={},
    getReadMsgFromIm=0;

function updateServer(){
    if(updateStart){
        var isGetRead;
        if (isOneChat=='general_chat') {
            var status={};
            getReadMsgFromIm={};
            isGetRead = typeof userAllowedFeature != 'undefined' ? false : true;
            if(isGetRead){//for impact mobile disabled
                $('[data-msg-user-id='+siteGuid+'].im_msg_one .msg_read.hide').each(function(){
                    var $el=$(this).closest('.im_msg_one');
                    getReadMsgFromIm[$el.data('toUserId')]=1;
                })
            }
            getReadMsgFromIm=JSON.stringify(getReadMsgFromIm);
        } else {
            prepareStatusWritingImOne();
            var status=status_writing;
            getReadMsgFromIm=0;
            isGetRead = typeof userAllowedFeature != 'undefined' ? userAllowedFeature['message_read_receipts'] : true;
            if (isGetRead && $('[data-msg-user-id='+siteGuid+'].im_msg_one .msg_read.hide')[0]) {
                getReadMsgFromIm=1;
            }
        }
        //console.log('AJAX:',isOneChat, getReadMsgFromIm, userAllowedFeature);
        $.post(url_main+'update_server_ajax.php',
               {cmd:'update_im',
                users_list:JSON.stringify(users_list),
                user_to:userTo,
                display:isOneChat,
                last_id:last_id,
                status_writing:status,
                get_read_msg_from_im:getReadMsgFromIm,
                is_mode_fb:isFbMode,
                timeout_server:timeoutSecServer,
                page:activePage,
                request_user_id:requestUserId,
                city_counter_street_chat: $('#user_menu_counter_street_chat, .counter_street_chat').length,
                city_counter_games: $('#user_menu_counter_game_choose, .counter_game_choose').length,
                city_counter: $('#user_menu_counter_3d_city, .counter_3d_city').length,
                geo_position:geoPoint
                },
                function(res){
                    var data=$.trim(checkDataAjax(res));
                    if (data!==false) {
                        if(isOneChat=='general_chat'){
                            messages.update(data)
                        }else{
                            messages.updateOneChat(data)
                        }
                    }
                }
        );
    }
    clearTimeout(timeout);
    timeout=setTimeout('updateServer()', timeoutSec);
}

function initServer(){
    if(!ajax_login_status)return;
    updateStart=true;
    timeout=setTimeout('updateServer()', timeoutSec);
}

$(function(){
    if (activePage=='messages.php') {
        $.winFocus({
            blur: function(e) {
                if (ajax_login_status) {
                    localStorage.setItem('is_fb_mode', 'true');
                    isFbMode = 'true';
                }
            },
            focus: function(e) {
                if (ajax_login_status) {
                    if(isFirstLoad){
                        isFirstLoad=false;
                        return;
                    }
                    localStorage.setItem('is_fb_mode', 'false');
                    isFbMode = 'false';
                    $.post(url_main+'update_server_ajax.php?cmd=read_msg',{user_id:userTo,is_mode_fb:'false'});
                }
            }
        });
        $(window).on('storage', function(e) {
            var event = e.originalEvent;
            if (event.key === 'is_fb_mode') {
                isFbMode = event.newValue;
            }
        });
    }

});