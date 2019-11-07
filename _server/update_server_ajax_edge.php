<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../';
include('../_include/core/main_start.php');

$guid = guid();
$siteGuid = get_param('site_guid', false);
if ($siteGuid !== false && $siteGuid != $guid) {
    echo getResponseAjaxByAuth(false);
    die();
}

global $g;
global $g_user;

$responseData = false;
$dirTmpl = $g['tmpl']['dir_tmpl_main'];
$cmd = get_param('cmd');
$curPage = get_param('page');
$requestUid = get_param('request_user_id');
$display = get_param('display');

$scriptJs = '';
function addJsScript(&$scriptJs, $script){
    $scriptJs .= $script;
}

if ($cmd == 'read_msg') {
    $responseData = CIm::setMessageAsRead();
} elseif ($cmd == 'activate_im') {
    CIm::setMessageAsRead();
    CIm::setLastViewedIm();
	$responseData = array('count' => CIm::getCountNewMessages(), 'enabled' => CIm::getCountAllMsgIm());
} elseif ($cmd == 'set_event_window') {
    CIm::setWindowEvent();
    if (get_param('location')) {
        City::setWindowEvent();
    }
} elseif ($cmd == 'update_im' && $guid) {
    $responseData = '';
    $isVisibleMessages = get_param('is_visible_messages');
    $isFbModeTitle = get_param('is_mode_fb');
    if ($isVisibleMessages == 'true') {
        CIm::setWriting();
        $page = new CIm('', "{$dirTmpl}_pp_messages_list_msg.html");
        $responseData .= '<div class="update_msg_im">' . getParsePageAjax($page) . '</div>';
    }

    $countNewMessages = CIm::getCountNewMessages();
    if ($isFbModeTitle == 'true'){
        $lastImMsg = get_session('window_last_im_msg');
        $where = '`to_user` = ' . to_sql($g_user['user_id'], 'Number')
               . ' AND id > ' . to_sql($lastImMsg, 'Number')
               . ' AND `is_new` = 1' . CIm::getWhereNoSysytem();
        $count = DB::count('im_msg', $where);

        $cityCount = 0;
        $cityCountWindowEvent = 0;
        $cityCountNew = 0;
        $cityRoom = get_param('location');
        $cityCountEventLast = 0;
        if ($cityRoom) {
            $cityCountNew = City::getCountNewMessages();
            $cityCount = City::getCountNewMessages(null, null, get_session('window_last_city_msg'));
            $cityCountWindowEvent = $cityCount - get_session('window_count_city_event', 0);
            $cityCountEventLast = get_session('window_count_city_event_last', 0);
        }

        $countEvent = $count - get_session('window_count_event', 0) + $cityCountWindowEvent;
        $countEventLast = get_session('window_count_event_last', 0) + $cityCountEventLast;

        if ($countEvent > 0
            || ($countEventLast && !($countNewMessages + $cityCountNew))) {
            $titleCounter = $countEvent ? lSetVars('title_site_counter', array('count' => $countEvent)) : '';
            $setEvent = "localStorage.setItem('title_site_counter', '" . $titleCounter . "');
                         $('title').text('" . $titleCounter . " '+siteTitle);";
            addJsScript($scriptJs, $setEvent);
            set_session('window_count_event_last', $countEvent);
            set_session('window_count_city_event_last', $cityCountEventLast);
        }
    }

    $counters = array();
    /* Notification new friends request and update friends list */
    if (Common::isOptionActive('friends_enabled')) {
        $countPendingFriends = User::getNumberRequestsToFriendsPending();
        $counters['friends_pending'] = array('count' => $countPendingFriends, 'enabled' => $countPendingFriends);
        if ($countPendingFriends) {
            $where = '';
            $friendsNotification = get_param('friends_notification');
            if ($friendsNotification) {
                $where = ' AND FR.created_at > ' . to_sql($friendsNotification);
            }
            $friendsPendingList = TemplateEdge::getFriendsPending($where, 'ASC', true);
            if ($friendsPendingList) {
                addJsScript($scriptJs, 'clFriends.updateListNotification(' . json_encode($friendsPendingList) . ');');
            }
        }
        addJsScript($scriptJs, 'clFriends.updateFriends(' . json_encode(TemplateEdge::getListFriends(null, true)) . ',true);');
        if (get_param_int('get_list_friends')) {
            addJsScript($scriptJs, 'clFriends.updateFriends(' . json_encode(TemplateEdge::getListFriends()) . ');');
        }
    }
    /* Notification new friends request and update friends list */

    /* Notification new events */
    $events = array(
        'new_count' => User::getNumberGlobalEvents(),
        'new_list'  => User::getListGlobalEvents(null, 'ASC')
    );

    addJsScript($scriptJs, 'clEvents.updateEvents(' . json_encode($events) . ');');


    /* Notification new events */
    $lastNewMessageInfo = CIm::getLastNewMessageInfo();
    $counters['new_message'] = array('count' => $countNewMessages,
                                     'enabled' => CIm::getCountAllMsgIm(),
                                     'uid' => $lastNewMessageInfo['uid'],
                                     'url_notif' => User::url($guid, null, array('show' => 'message', 'uid_sender' => $lastNewMessageInfo['uid'])),
                                     'msg' => $lastNewMessageInfo['message']
                               );


    $counters = json_encode($counters);
    addJsScript($scriptJs, 'clCounters.update(' . $counters . ');');

    $lastNewMessageInfo = City::getLastNewMessageInfo();
    addJsScript($scriptJs, 'mobileAppCityNotification(' . json_encode($lastNewMessageInfo) . ');');

    //if ($curPage == 'search_results.php') {
        if ($requestUid && $requestUid != $guid) {
            addJsScript($scriptJs, "clProfile.updateOnlineStatus(" . intval(User::isOnline($requestUid, null)) . "," . intval(User::isOnline($requestUid, null, true)) . ");");
        }
    //}

    /* Chat */
    $typeChat = array('audio', 'video');
    foreach ($typeChat as $type) {
        $chatData = Chat::update($type);
        if (Chat::isAction($chatData)) {
            addJsScript($scriptJs, 'cl' . ucfirst($type) . "Chat.request(" . json_encode($chatData) . ");");
        }
    }
    $chatData = CityStreetChat::update();
    if ($chatData) {
        addJsScript($scriptJs, "clCityStreetChat.request(" . json_encode($chatData) . ");");
    }

    addJsScript($scriptJs, "clProfile.updateServerMyData(" . User::accessСheckFeatureSuperPowersGetList() . ");");
    addJsScript($scriptJs, "setGUserOptions(" . Common::getGUserJs() . ");");

    if ($scriptJs) {
        $responseData .= '<div class="script"><script>' . $scriptJs . '</script></div>';
    }
} elseif ($cmd == 'chat_invite') {
    $responseData = Chat::invite();
} elseif ($cmd == 'chat_reject') {
    $responseData = Chat::reject();
} elseif ($cmd == 'chat_talk') {
    $responseData = Chat::talk();
} elseif ($cmd == 'chat_paid') {
    $responseData = Chat::paid();
} elseif ($cmd == 'chat_request_check') {//For notification
    $type = get_param('type');
    $uid = get_param_int('uid');
    if ($type == 'street') {
        $responseData = CityStreetChat::checkRequest($uid, get_param('data'));
    } else {
        $responseData = Chat::checkRequest($type, $uid);
    }
} elseif ($cmd == 'city_street_chat_invite') {
    $responseData = CityStreetChat::invite();
} elseif ($cmd == 'city_street_chat_reject') {
    $responseData = CityStreetChat::reject();
} elseif ($cmd == 'city_street_chat_start') {
    $responseData = CityStreetChat::start();
}


if (isset($responsePage)) {
    echo getResponsePageAjaxByAuth($guid, $responsePage);
}

if (isset($responseData)) {
    echo getResponseAjaxByAuth($guid, $responseData);
}

DB::close();