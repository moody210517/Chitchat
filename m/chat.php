<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

payment_check('flash_chat');

$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/chat.css" type="text/css" media="all"/>';
CStatsTools::count('flash_chat_opened');
class CChat extends CHtmlBlock
{
	function action()
	{
		global $g;
		global $g_user;

        $now = time();

		$room = Flashchat::getDefaultRoom();
        Flashchat::login(true);
        /*$user = Flashchat::user();
        if(!$user) {
            DB::execute("INSERT INTO flashchat_users (id,login,mess_color,time_out,status,sys_color,room,gender,user_id)
                VALUES (NULL, ".to_sql($g_user['name']).",'','".$now."','0','','1','" . strtolower($g_user['gender']) . "'," . to_sql($g_user['user_id']) . ")");
        } else {
            if(Flashchat::isBanned($user)) {
                redirect(Common::getHomePage());
            }
            Flashchat::updateVisit();
        }*/

		$message = get_param("message", "");
		if($message)
		{            
			DB::execute("
			INSERT INTO `flashchat_messages` ( `id` , `time` , `status` , `msgtext` , `user` , `room`, `user_id` )
			VALUES (
			'', '".time()."', '', ".to_sql($message, 'Text').", ".to_sql($g_user['name'], 'Text').", " . to_sql($room) . ", " . to_sql($g_user['user_id']) . "
			);");
		} /*else {
            $message = to_sql('joined the room ' . Flashchat::roomName(1), 'Plain');
            DB::execute("INSERT INTO `flashchat_messages` (id,time,status,msgtext,user,room,user_id)
                VALUES ('','".time()."','system','".$message."'," . to_sql($g_user['name'], 'Text') . ",1,". to_sql($g_user['user_id']) . ")");
        }*/
	}
	function parseBlock(&$html)
	{

		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CChat("", $g['tmpl']['dir_tmpl_mobile'] . "chat.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('chat');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
