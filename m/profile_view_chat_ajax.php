<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/pony_start.php");

if(!guid()) {
    die();
}

if(User::isBlocked('im', get_param('user_id', ''), guid())) {
    die('you_are_blocked');
}

class CChatAjax extends CHtmlBlock
{
	function init()
	{
		parent::init();

		$from_id = get_param('user_id', '');
		$to_id = guid();
                $open=get_param('open', '');
                $this->open=array_flip(explode(',',$open));
                

		$this->m_on_page = 8;
		$where = "WHERE ((from_user=".to_sql($from_id, 'Number')." AND to_user=".to_sql($to_id, 'Number')." AND to_user_deleted = 0)
                      OR (from_user=".to_sql($to_id, 'Number')." AND to_user=".to_sql($from_id, 'Number')." AND from_user_deleted = 0))
                  ORDER BY id ASC, born ASC";
		$this->m_sql_count = "SELECT count(id) FROM im_msg ".$where;
		$this->m_sql = "SELECT * FROM im_msg ".$where;
		$this->m_sql_clear_new = "UPDATE im_msg SET is_new = 0 WHERE (to_user=".to_sql(guid(), 'Number') . " AND from_user = " . to_sql($from_id, 'Number') . ")";
	}

	function onItem(&$html, $row)
	{
        $isParse = true;

        if(guid()!=$row['from_user']){
            $row=CIm::switchOnTranslate($row);     
        } else {
            $row['msg_translation']='';
        }
        
        if ($row['system']) {
            $types = array(/*'sent_to_user_popular_f',
                           'sent_to_user_popular_m',
                           'msg_limit_is_reached_f',
                           'msg_limit_is_reached_m',*/
                           'sent_to_block_list');
            if (in_array($row['msg'], $types)) {
                $msg = CIm::grabsRequest($row['msg'], $row['from_user'], $row['to_user']);
            } else {
                $isParse = false;
            }
        } else {
            $msg = Common::parseLinksSmile($row['msg'], '_blank', '', false);
        }
        if ($isParse) {
            $html->setvar('user_id', DB::result("select user_id from user where name=".to_sql($row['name'], 'Text')."", 0, 1));
            $html->setvar('user', $row['name']);
            #$msg = str_replace('{patch}', '../', replaceSmile($row['msg']));
            //$msg = replaceSmile($msg);
            $html->setvar('msgtext', $msg);
              $html->setvar('user', $row['name']);
            $html->setvar('id_msg', $row['id']);
            if($row['msg_translation']!=''  && Common::isOptionActive('autotranslator_show_original')){
                $html->parse('show_original_message_ico', false);
                if(isset($this->open[$row['id']])){
                    $html->setvar('display', 'block');
                } else {
                    $html->setvar('display', 'none');
                }
                $html->setvar('msg_translation', $row['msg_translation']);
                $html->parse('original_message', false);
            } else {
                $html->clean('show_original_message_ico');
                $html->clean('original_message');
            }
            if ($row['system']) {
                $html->parse('chat_system_item', false);
                $html->clean('chat_item');
            } else {
                $html->parse('chat_item', false);
                $html->clean('chat_system_item');
            }
            $html->parse('chat_items', true);
        }
	}

	function parseBlock(&$html)
	{
            DB::execute($this->m_sql_clear_new);
            $num = DB::result($this->m_sql_count);
            DB::query($this->m_sql . ' LIMIT ' . max(0, $num - $this->m_on_page) . ', ' . $this->m_on_page);
            
            while($row = DB::fetch_row()) {
                self::onItem($html, $row);
            }
            parent::parseBlock($html);
	}
}

$page = new CChatAjax("chat", $g['tmpl']['dir_tmpl_mobile'] . "profile_view_chat_ajax.html");

include("./_include/core/main_close.php");