<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");



$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/friends.css" type="text/css" media="all"/>';
$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/home.css" type="text/css" media="all"/>';

class CUsersInfoFriends extends CUsersInfo
{
	var $user_id = null;
	var $parsed_item_n;

	function action()
	{
		global $g;
		global $g_user;

		$cmd = get_param("cmd", "");
        $redirect = get_param('redirect', '');

		if ($cmd == "delete") {
			foreach($_REQUEST as $name => $value)
			{
				if(substr($name, 0, 7) == 'delete_')
				{
					$id = substr($name, 7);
					if(is_numeric($id)) {
						User::friendDelete(guid(), $id);
					}
				}
			}

            if($redirect == 'back') {
                redirect($_SERVER['HTTP_REFERER']);
            }
		}
	}

	function onItem(&$html, $row, $i, $last)
	{
		parent::onItem($html, $row, $i, $last);

		global $g_user;

        if(isset($row['name'])) {
            $firstNameParts = explode(' ', $row['name']);
            $html->setvar('name_first', $firstNameParts[0]);
        }

		if($this->user_id == $g_user['user_id'])
			$html->parse('delete_checkbox', false);

		++$this->parsed_item_n;
	}

	function parseBlock(&$html)
	{
		global $g_user;

		$html->setvar('user_id', $this->user_id);

		if($this->user_id == $g_user['user_id'])
		{
			$html->parse('my_friends', true);
			$html->parse('delete_button', true);
		}
		else
		{
			$html->setvar('name', DB::result("SELECT name FROM user WHERE user_id=".to_sql($this->user_id, 'Number')));
			$html->parse('another_user_friends', true);
		}

		$this->parsed_item_n = 1;

		parent::parseBlock($html);
	}

	function onPostParse(&$html,$row=array())
	{
		for($i = $this->parsed_item_n; $i <= 8; ++$i)
		{
			if($this->row_breaks && !($i % $this->row_breaks_n_cols))
				$html->setvar('row_break', '</tr><tr>');
			else
				$html->setvar('row_break', '');
			$html->parse('users_list_no_item');
		}
	}
}

$user_id = intval(get_param('user_id', $g_user['user_id']));

if($user_id == $g_user['user_id'])
{
	$l['profile_view_friends.php']['title'] = $g['main']['title'] . ' - My Friends';
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_mobile'] . "profile_view_friends.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$list = new CUsersInfoFriends("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_info_friends.html");

$list->m_last_visit_only_online = true;
$list->m_on_page = 8;
$list->row_breaks = true;
$list->row_breaks_n_cols = 4;
$list->user_id = $user_id;

#$list->m_debug = 'Y';

$list->m_sql_from_add = ' JOIN friends_requests AS f
    ON ( (u.user_id = f.user_id AND f.friend_id = ' . to_sql($user_id, 'Number') . ')
        OR (u.user_id = f.friend_id AND f.user_id = ' . to_sql($user_id, 'Number') . '))';
$list->m_sql_where = ' f.accepted = 1 ';

$page->add($list);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
if($user_id == $g_user['user_id'])
{
	$user_menu->setActive('friends');
}
$page->add($user_menu);

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_view_menu.html");
$profile_view_menu->user_id = $user_id;
$list->add($profile_view_menu);

include("./_include/core/main_close.php");

?>