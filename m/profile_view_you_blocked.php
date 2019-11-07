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
	}


	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		parent::parseBlock($html);
	}
}

class CYouBlocked extends CHtmlBlock
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

		$user_id = get_param('user_id');
        $option = get_param('option', 'mail');

		if(!User::isBlocked($option, $user_id, guid()))
			Common::toHomePage();

		DB::query("SELECT * FROM user WHERE user_id=" . to_sql($user_id, 'Number'));
		$user = DB::fetch_row();

		$html->setvar('blocked_name', $user['name']);
		$html->setvar('blocked_user_id', $user['user_id']);

		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CProfile("", $g['tmpl']['dir_tmpl_mobile'] . "profile_view.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$type = get_param("display", "profile");
if ($type == "info") $list = new CUsersInfo("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_info.html");
elseif ($type == "gallery") $list = new CUsersGallery("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_gallery.html");
elseif ($type == "list") $list = new CUsersList("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_list.html");
elseif ($type == "profile") $list = new CUsersProfile("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_profile.html");
elseif ($type == "photo") $list = new CHtmlUsersPhoto("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_photo.html");
else redirect("users_online.php");

$user_id = get_param('user_id', $g_user['user_id']);

$list->m_sql_where = "u.user_id=" . to_sql($user_id, 'Number') . "";
$list->m_is_me = ($user_id == $g_user['user_id']) ? true : false;
$page->add($list);

$friends_list = new CYouBlocked("friends_list", $g['tmpl']['dir_tmpl_mobile'] . "_you_blocked.html");
$friends_list->user_id = $user_id;
$page->add($friends_list);

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_view_menu.html");
$profile_view_menu->user_id = $user_id;
$page->add($profile_view_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
