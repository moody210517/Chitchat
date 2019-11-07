<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/home.css" type="text/css" media="all"/>';

//if (defined('IS_DEMO')) {
//	DB::query("SELECT * FROM im_open WHERE to_user=12 AND from_user=" . to_sql($g_user['user_id'], "Number") . "");
//	if (DB::num_rows() == 0) DB::execute("INSERT INTO im_open SET to_user=12, from_user=" . to_sql($g_user['user_id'], "Number") . "");
//}

class CProfile extends CHtmlBlock
{
	function action()
	{
		global $g;
		global $g_user;
		$cmd = get_param("cmd", "");
		if ($cmd == "hide") DB::execute("UPDATE user SET hide_time=" . to_sql(30, "Number") . " WHERE user_id=" . get_session("user_id") . "");
		elseif ($cmd == "active") DB::execute("UPDATE user SET hide_time=0 WHERE user_id=" . get_session("user_id") . "");
	}
	function parseBlock(&$html)
	{
		global $g;
		global $l;
		global $g_user;
		global $g_info;
		global $gc;

		if ($g['options']['recorder'] == "Y")
		{
			$html->setvar("unique", str_replace(".", "", str_replace("www.", "", $_SERVER['HTTP_HOST'])));
			$html->setvar("myname", $g_user['name']);
			$html->parse("myrecorder", true);
			$html->parse("myrecorder_swf", true);
		}


		if ($g['options']['biorythm'] == "Y") {
			$html->setvar("user_id", $g_user['user_id']);
			$html->parse("biorythm", false);
		}



		foreach ($g_user as $k => $v) $html->setvar($k, $v);

		if($g_user['new_mails'])
			$html->parse('new_mails_exists', true);
		else
			$html->parse('new_mails_none', true);
        if(Common::isOptionActive('viewed_me_tab_enabled')) {
            if($g_user['new_views'])
                $html->parse('new_views_exists', true);
            else
                $html->parse('new_views_none', true);
            $html->parse('viewed_me');
        }
        if(Common::isOptionActive('mail')) {
            $html->parse('mail_on');
        }

		foreach ($g_info as $k => $v) $html->setvar($k, $v);

		$photo = DB::result("SELECT photo_id FROM photo WHERE user_id=" . get_session("user_id") . " ORDER BY photo_id LIMIT 1");
		if ($photo == 0)
		{
			$html->parse("user_no_photo", true);
		}
		else
		{
			$photo = User::getPhotoDefault(guid(), 's');
			$html->setvar("photo", $photo);
			$html->parse("user_photo", true);
		}

		$city_title = (($g_user['city'] == "" or $g_user['city'] == "0") ? '' : (isset($l['all'][to_php_alfabet($g_user['city'])]) ? $l['all'][to_php_alfabet($g_user['city'])] : $g_user['city']));
		$state_title = (($g_user['state'] == "" or $g_user['state'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['state'])]) ? $l['all'][to_php_alfabet($g_user['state'])] : $g_user['state']));
		$country_title = (($g_user['country'] == "" or $g_user['country'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['country'])]) ? $l['all'][to_php_alfabet($g_user['country'])] : $g_user['country']));

		$html->setvar("country_title", $country_title);
		$html->setvar("state_title", $state_title);
		if($city_title)
			$html->setvar("city_title", '<p>' . $city_title . '</p>');
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

class CBanerHome extends CHtmlBlock
{
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		if (User::isPaid(guid()))
            $baner = get_banner("home_gold");
		else
            $baner = get_banner("home");
		if ($baner !== false)
		{
			$html->setvar("banner_home", $baner);
			$html->parse("banner_home", true);
			parent::parseBlock($html);
		}
	}
}

$page = new CProfile("", $g['tmpl']['dir_tmpl_mobile'] . "home.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$friends_list = new CFriendsList("friends_list", $g['tmpl']['dir_tmpl_mobile'] . "_friends_list.html");
$page->add($friends_list);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
