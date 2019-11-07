<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//$area = "login";
include("./_include/core/pony_start.php");

if(!guid()) {
    die();
}

if(Flashchat::isBanned(Flashchat::user())) {
    die('ban');
}

Flashchat::updateVisit();

//payment_check('3d_chat');

class CChatAjax extends CHtmlBlock
{
	function init()
	{
		parent::init();
		global $g;
		global $g_user;

		$id = get_param("id", "");

        $room = Flashchat::getDefaultRoom();
		$this->m_on_page = 11;
		$this->m_sql_count = "SELECT count(id) FROM flashchat_messages WHERE room=" . to_sql($room) . " ORDER BY id ASC, time ASC";
		$this->m_sql = "SELECT * FROM flashchat_messages WHERE room=" . to_sql($room) . " ORDER BY id ASC, time ASC";
		//$this->m_debug = "Y";
	}
	function onItem(&$html, $row)
	{
		global $g;

        //$row['msgtext'] = Flashchat::translateSystemMessage($row['msgtext']);

		$html->setvar('user_id', DB::result("select user_id from user where name=".to_sql($row['user'], 'Text')."", 0, 2));
		$html->setvar('user', $row['user']);
        //$msg = Common::parseLinksSmile($row['msgtext'], '_blank', '', false);
        $msg = Flashchat::parseMsg($row['msgtext'], $row['status'], $row['room'], $row['user']);
        //$msg = replaceSmile($msg);
		#$html->setvar('msgtext', strip_tags($msg,'a'));
        $html->setvar('msgtext', $msg);
		$html->parse('chat_item', true);
	}
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;

		$num = DB::result($this->m_sql_count);
		DB::query($this->m_sql . " LIMIT ".max(0, $num - $this->m_on_page).", ".$this->m_on_page, 1);
		while($row = DB::fetch_row(1))
		{
			self::onItem($html, $row);
		}

		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CChatAjax("chat", $g['tmpl']['dir_tmpl_mobile'] . "chat_ajax.html");

include("./_include/core/main_close.php");
