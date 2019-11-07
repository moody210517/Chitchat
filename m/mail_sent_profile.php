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
	var $m_on_page = 20;
	var $message = "";
	var $id;
	var $subject;
	var $text;
	var $type = 'plain';
	function action()
	{
		global $g_user;
		global $g;
		global $l;

	}
	function parseBlock(&$html)
	{
		global $g_user;

		$user_id = get_param('user_id', $g_user['user_id']);
		DB::query("SELECT user_id, name FROM user WHERE user_id=" . to_sql($user_id, "Number") . " ");
        $row = DB::fetch_row();
        
        $mode = get_param("mode", "");
        $html->setvar("recipient_id", $row['user_id']);
        if ($mode == 'profile') {
            $html->parse("back_profile", true);
            $html->parse("profile", true);
        } else {
            $html->parse("back_inbox", true);
            $html->parse("inbox", true);
        }
		$html->setvar("name", $row['name']);
		$html->parse("add_id", true);

		parent::parseBlock($html);
	}
}
g_user_full();

$page = new CProfile("", $g['tmpl']['dir_tmpl_mobile'] . "mail_sent_profile.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$user_id = get_param('user_id', $g_user['user_id']);

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_view_menu.html");
$profile_view_menu->user_id = $user_id;
$page->add($profile_view_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
