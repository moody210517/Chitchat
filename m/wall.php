<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include_once("./_include/core/pony_start.php");


$uid = intval(get_param('uid'));

$g['tmpl']['dir_tmpl_main'] = $g['tmpl']['dir_tmpl_mobile'];
$page = Wall_Page::show();

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('wall');
$page->add($user_menu);

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_wall_profile_view_menu.html");
$profile_view_menu->user_id = $uid;
$page->add($profile_view_menu);

include("./_include/core/main_close.php");