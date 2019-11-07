<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
$area = 'login';
include('./_include/core/pony_start.php');

if (Common::getOption('set', 'template_options') != 'urban'
        ||Common::getOption('type_media_chat') != 'webrtc') {
    redirect(Common::getHomePage());
}
checkAccessFeatureByPayment('videochat');

if (get_param('type')) {
    Chat::talk();
}

class CVc extends CHtmlBlock
{
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;

        $callUid = intval(get_param('id'));
        $sql = "SELECT *
                  FROM `user`
                 WHERE `user_id` = " . to_sql($callUid);
        DB::query($sql);
		if ($row = DB::fetch_row()){
            if (IS_DEMO && get_param('demo')) {
                $html->setvar('demo_url', Common::urlSiteSubfolders());
                $html->setvar('demo_user_gender', mb_strtolower(User::getInfoBasic($callUid, 'gender'), 'UTF-8'));
                $html->setvar('demo', 1);
            }
            $sql = "DELETE FROM `video_reject`
                     WHERE `to_user` = " . to_sql($g_user['user_id'])
                   . " AND `from_user` = " . to_sql($row['user_id']);
            DB::execute($sql);
			if (User::isOnline($row['user_id'], $row, true)) {
                $html->setvar('is_mobile', Common::isMobile(false, true, true));
                $html->setvar('media_server', $g['webrtc_app']);

                $html->setvar('client_id', Chat::getIdByChat($callUid, true, 'video'));
                $html->setvar('call_to_id', Chat::getIdByChat($callUid, false, 'video'));

                if(!Common::isApp()) {
                    $html->parse('video_chat_webrtc_js_browser_version');
                }

                $html->parse('video_chat_webrtc_js_src', false);
				$html->parse('video_chat_webrtc_js', false);
			} else {
                $html->parse('alert_js');
            }
		} else {
            Common::toHomePage();
        }

		parent::parseBlock($html);
	}
}

$optionTmplSet = Common::getOption('set', 'template_options');

$page = new CVc("", $g['tmpl']['dir_tmpl_mobile'] . "videochat.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);

if (Common::isParseModule('user_menu')) {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    if ($optionTmplSet == 'urban') {
        $header->add($user_menu);
    } else {
        $page->add($user_menu);
    }
}

$tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer.html";
if (Common::isOptionActive('is_allow_empty_footer', 'template_options')) {
    $tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer_empty.html";
}
$footer = new CFooter("footer", $tmplFooter);
$page->add($footer);

loadPageContentAjax($page);

include('./_include/core/main_close.php');