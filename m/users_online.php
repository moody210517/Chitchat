<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/online.css" type="text/css" media="all"/>';

class CUsersInfoCustom extends CUsersInfo
{
	var $parsed_item_n;
	var $m_city_postfix = ",<br/>";

	function onItem(&$html, $row, $i, $last)
	{
		parent::onItem($html, $row, $i, $last);

		++$this->parsed_item_n;
	}

	function parseBlock(&$html)
	{
		$this->parsed_item_n = 1;

		parent::parseBlock($html);
	}

	function onPostParse(&$html,$row=array())
	{
		for($i = $this->parsed_item_n; $i <= 5; ++$i)
		{
			if($this->row_breaks && !($i % $this->row_breaks_n_cols))
				$html->setvar('row_break', '</tr><tr>');
			else
				$html->setvar('row_break', '');
			$html->parse('users_list_no_item');
		}
	}
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_mobile'] . "users_online.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$list = new CUsersInfoCustom("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_info.html");

$defaultOnlineView = User::defaultOnlineView();
$filter = $defaultOnlineView != '' ? $defaultOnlineView : $g['sql']['your_orientation'];

$list->m_sql_where = 'u.user_id != ' . guid() . '
    AND hide_time = 0 ' . $filter. '
    AND last_visit > ' . to_sql((date("Y-m-d H:i:s", time() - $g['options']['online_time'] * 60)), 'Text');
$list->m_sql_order = 'is_photo DESC, ' . Common::getSearchOrderNear() . 'user_id DESC';
$list->m_last_visit_only_online = true;
$list->m_on_page = 5;
$list->row_breaks = true;

$page->add($list);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('online');
$page->add($user_menu);

include("./_include/core/main_close.php");