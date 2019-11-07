<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/home.css" type="text/css" media="all"/>';

class CProfile extends CHtmlBlock
{
	function action()
	{
		global $g;
		global $g_user;

        $uid = get_param('user_id', '');

        $sql = 'SELECT * FROM friends_requests
            WHERE friend_id = ' . to_sql($g_user['user_id'], 'Number') . '
                LIMIT 1';
		DB::query($sql);
		if(!DB::fetch_row()) {
            Common::toHomePage();
		}

		$cmd = get_param("cmd", "");

		if($cmd == 'reject') {
            User::friendDecline($uid, guid());
			redirect('view_friend_requests.php');
		}
		if($cmd == 'accept') {
            User::friendApprove($uid, guid());
			redirect('view_friend_requests.php');
		}
	}
	function parseBlock(&$html)
	{
		global $g;
		global $l;
		global $g_user;
		global $g_info;

		foreach ($g_user as $k => $v) {
            $html->setvar($k, $v);
        }

		if($g_user['new_mails']) {
			$html->parse('new_mails_exists', true);
        } else {
			$html->parse('new_mails_none', true);
        }

        if($g_user['new_views']) {
			$html->parse('new_views_exists', true);
        } else {
                $html->parse('new_views_none', true);
        }

        foreach ($g_info as $k => $v) {
            $html->setvar($k, $v);
        }

        $photo = User::getPhotoDefault(guid(), 'm');

        $html->setvar("photo", $photo);
        $html->parse("user_photo", true);

		$city_title = (($g_user['city'] == "" or $g_user['city'] == "0") ? '' : (isset($l['all'][to_php_alfabet($g_user['city'])]) ? $l['all'][to_php_alfabet($g_user['city'])] : $g_user['city']));
		$state_title = (($g_user['state'] == "" or $g_user['state'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['state'])]) ? $l['all'][to_php_alfabet($g_user['state'])] : $g_user['state']));
		$country_title = (($g_user['country'] == "" or $g_user['country'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['country'])]) ? $l['all'][to_php_alfabet($g_user['country'])] : $g_user['country']));

		$html->setvar("country_title", $country_title);
		$html->setvar("state_title", $state_title);
		if($city_title)
			$html->setvar("city_title", '<p>City: ' . $city_title . '</p>');
		$html->setvar("country", $g_user['country_id']);
		$html->setvar("state", $g_user['state_id']);
		$html->setvar("city", $g_user['city_id']);

		$hide = DB::result("SELECT hide_time FROM user WHERE user_id=" . get_session("user_id") . "");
		if ($hide > 0) $html->parse("active", true);
		else $html->parse("hide", true);
		if ($g_user['gold_days'] > 0) $html->parse("my_gold", true);
		else $html->parse("my_nogold", true);
		if ($g_user['gender'] == 'M') $html->parse("my_male", true);
		else $html->parse("my_female", true);

		if ($g_user['city_id'] > 0 and $g_user['city'] != '') {
			$html->parse("new_near", true);
		}

		parent::parseBlock($html);
	}
}

class CFriendRequest extends CHtmlBlock
{
	function action()
	{
	}
	function parseBlock(&$html)
	{
		global $g;
		global $l;
		global $g_user;
		global $g_info;
		global $gc;

        $sql = 'SELECT * FROM friends_requests
            WHERE friend_id = ' . to_sql(guid(), 'Number') . '
                AND accepted = 0
            ORDER BY created_at DESC
            LIMIT 1';
        DB::query($sql);

		if($request = DB::fetch_row()) {
			$friend = User::getInfoBasic($request['user_id']);
            $friend['photo'] = User::getPhotoDefault($request['user_id'], 'r');
			$friend['last_visit'] = time_mysql_dt2u($friend['last_visit']);
			if (((time() - $friend['last_visit']) / 60) < Common::getOption('online_time')) {
                $html->parse('online', false);
            }

			$html->setvar('friend_user_id', $friend['user_id']);
			$html->setvar('friend_name', $friend['name']);

			$html->setvar('photo', $friend['photo']);
			$html->setvar('last_visit', $friend['last_visit']);
		} else {
			Common::toHomePage();
		}

		parent::parseBlock($html);
	}
}

$page = new CProfile("", $g['tmpl']['dir_tmpl_mobile'] . "home.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$friends_list = new CFriendRequest("friends_list", $g['tmpl']['dir_tmpl_mobile'] . "_friend_request.html");
$page->add($friends_list);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");

?>