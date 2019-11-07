<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/pony_start.php');

checkByAuth();

$cmd = get_param('cmd');
$display = get_param('display');
$uid = get_param('user_id');
$userTo = get_param('user_to');
$isAjaxRequest = get_param('ajax', 0);

if($display == 'one_chat') {
    if ($isAjaxRequest && $userTo == guid()
        && ($cmd == 'send_message' || $cmd == 'send_message_one')){
        die(getResponseDataAjaxByAuth('redirect'));
    }
    if ($uid == guid()){
        redirect('messages.php');
    }else if (!$isAjaxRequest) {
        CIm::setMessageAsRead();
    }
}

class CMessages extends CIm
{
	function action()
	{
		global $g;
		global $g_user;
        $cmd = get_param('cmd');
        $isAjaxRequest = get_param('ajax', 0);
        if ($isAjaxRequest) {
            $isResponseData = false;
            if ($cmd == 'clear_history_messages') {
                $responseData = CIm::clearHistoryMessages();
                $isResponseData = true;
            }elseif ($cmd == 'send_message_one'){
                $uid = get_param('user_to', 0);
                $html = null;
                $responseData = CIm::addMessage($html, $uid, null, false);
                /*if ($responseData) {
                    $responseData = CIm::replyOnNewContactRateLevel(User::getInfoBasic($uid));
                }*/
                $isResponseData = true;
            }
            if ($isResponseData) {
                die(getResponseDataAjaxByAuth($responseData));
            }
        }
	}

	function parseBlock(&$html)
	{
        $cmd = get_param('cmd');
        $display = get_param('display');
        if ($cmd != 'send_message') {
            if ($html->varExists('you_have_no_messages_yet')) {
                $vars = array('url' => Common::pageUrl('search_results'));
                $attr = array();
                $optionTmplName = Common::getOption('name', 'template_options');
                if ($optionTmplName == 'impact_mobile') {
                    $attr = array('class' => 'go_to_page',
                                  'data-not-loader' => 'true',
                                  'data-layer-loader' => 'true');
                }
                $html->setvar('you_have_no_messages_yet', Common::lSetLink('you_have_no_messages_yet', $vars, false, '', $attr));
            }
            self::parseImMobile($html);

            if ($html->blockExists('btn_invite_audiochat') && Common::getOption('type_media_chat')=='webrtc') {
                if(Common::isOptionActive('audiochat')){
                    $html->parse('btn_invite_audiochat', false);
                }
                if(Common::isOptionActive('videochat')){
                    $html->parse('btn_invite_videochat', false);
                }
            }

            if ($display == 'one_chat' && $html->varExists('set_messages_counter')) {
                $counters = array('messages' => Menu::getCounterMessagesImpactMobile());
                $html->setvar('set_messages_counter', json_encode($counters));
            }
        }


		parent::parseBlock($html);
	}
}

$dirTmpl = $g['tmpl']['dir_tmpl_mobile'];
$tmpls = array();
if($isAjaxRequest) {
    if ($display == 'one_chat') {
        $tmpls['main'] = "{$dirTmpl}_messages_user_msg.html";
        if ($cmd != 'send_message') {
            $tmpls = array('main' => "{$dirTmpl}_messages_user.html",
                           'msg_list' => "{$dirTmpl}_messages_user_msg.html",
            );
        }
    } else {
        $tmpls = array('main' => "{$dirTmpl}_messages_list_users.html",
                       'msg_list' => "{$dirTmpl}_messages_list_msg.html",
        );
    }
} else {
    $tmplMain = "{$dirTmpl}messages.html";
    $tmplMainOption = Common::getOption('messages_one_chat_page_template', 'template_options');
    if ($display == 'one_chat' && $tmplMainOption) {
        $tmplMain = $dirTmpl . $tmplMainOption;
    }
    $tmpls = array('main' => $tmplMain,
                   'users_list' => "{$dirTmpl}_messages_list_users.html",
                   'msg_list' => "{$dirTmpl}_messages_list_msg.html",
    );
    if ($display == 'one_chat') {
        $tmpls['users_list'] = "{$dirTmpl}_messages_user.html";
        $tmpls['msg_list'] = "{$dirTmpl}_messages_user_msg.html";
    }
}

if ($isAjaxRequest && $cmd == 'send_message_one'){
    $page = new CMessages('', '', '', '', true);
    $page->action(false);
    die();
}

$page = new CMessages('', $tmpls);

if($isAjaxRequest) {
    stopScript(getResponsePageAjaxAuth($page));
}

$header = new CHeader('header', "{$dirTmpl}_header.html");
$page->add($header);

$tmplFooter = "{$dirTmpl}_footer.html";
if (Common::isOptionActive('is_allow_empty_footer', 'template_options')) {
    $tmplFooter = "{$dirTmpl}_footer_empty.html";
}
$footer = new CFooter("footer", $tmplFooter);
$page->add($footer);

if (Common::isParseModule('user_menu')) {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    $header->add($user_menu);
}

loadPageContentAjax($page);

include('./_include/core/main_close.php');