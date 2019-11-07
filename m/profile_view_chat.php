<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

$user_id = get_param('user_id');
$ajax = get_param('ajax');
if ($user_id == guid()) {
    if($ajax){
        die('redirect');
    }
    redirect('chat.php');
}

payment_check('im');

$g['to_head'][] = '<link rel="stylesheet" href="' . $g['tmpl']['url_tmpl_mobile'] . 'css/home.css" type="text/css" media="all"/>';

class CChat extends CHtmlBlock {

    function action()
    {
        global $p;
        global $g_user;

        $cmd = get_param('cmd');

        if ($cmd == 'new') {
            $sql = 'SELECT from_user FROM im_msg
                     WHERE to_user = ' . to_sql(guid(), 'Number') . '
                       AND is_new = 1
                     ORDER BY id DESC
                     LIMIT 1';
            $uid = DB::result($sql);
            if ($uid) {
                // set messages as read
                /*$sql = 'UPDATE im_msg
                           SET is_new = 0
                         WHERE to_user = ' . to_sql(guid(), 'Number') . '
                           AND from_user = ' . to_sql($uid, 'Number') . '
                           AND is_new = 1';
                DB::execute($sql);*/
                CIm::setMessageAsRead($uid);
            }

            // redirect to chat
            $url = $p . '?user_id=' . $uid;
            redirect($url);
        }

        $message = get_param('message', '');
        if ($message) {
            $user_id = get_param('user_id', '');
            if (guid()) {
                CIm::firstOpenIm($user_id);
                $toDelete = 0;
                $system = 0;
                $isFreeSite = Common::isOptionActive('free_site');
                $isSuperPowers = User::isSuperPowers();
                $isBlocked = User::isBlocked('im', $user_id, $g_user['user_id']);
                if ($isBlocked) {
                    $message = 'sent_to_block_list';
                    $system = 1;
                    $toDelete = 1;
                } /*elseif (!$isFreeSite && !$isSuperPowers) {
                    $numberSpMsgDay = $g_user['sp_sending_messages_per_day'] + 1;
                    $level = User::getLevelOfPopularity($user_id);
                    if ($numberSpMsgDay > Common::getOption('sp_sending_messages_per_day_urban')) {
                        $gender = User::getInfoBasic($user_id, 'gender');
                        $message = 'msg_limit_is_reached_' . mb_strtolower($gender, 'UTF-8');
                        $system = 1;
                        $toDelete = 1;
                    } elseif ($level == 'very_high') {
                        $gender = User::getInfoBasic($user_id, 'gender');
                        $message = 'sent_to_user_popular_' . mb_strtolower($gender, 'UTF-8');
                        $system = 1;
                        $toDelete = 1;
                    } else  {
                        User::update(array('sp_sending_messages_per_day' => $numberSpMsgDay));
                    }
                }*/

                $translated=CIm::getTranslate($message,$user_id);

                $row = array(
                    'from_user' => guid(),
                    'to_user' => $user_id,
                    'born' => date('Y-m-d H:i:s'),
                    'name' => guser('name'),
                    'msg' => strip_tags(chat_message_prepare($message, $user_id),'a'),
                    'ip' => IP::getIp(),
                    'to_user_deleted' => $toDelete,
                    'system' => $system,
                    'msg_translation' => strip_tags(chat_message_prepare($translated, $user_id),'a'),
                );
                DB::insert('im_msg', $row);
                CIm::updateLastIdFromAddMessage($user_id, DB::insert_id());
                CStatsTools::count('im_messages');
            }
        }
    }

    function parseBlock(&$html)
    {
        $id = get_param("user_id", "");

        DB::query("SELECT user_id, name FROM user WHERE user_id=" . to_sql($id, "Number") . " ");
        if ($row = DB::fetch_row()) {
            $html->setvar("name", $row['name']);
            $html->setvar("id", $row['user_id']);
            $html->setvar("user_id", guid());
        } else {
            Common::toHomePage();
        }

        parent::parseBlock($html);
    }

}

g_user_full();

$page = new CChat("", $g['tmpl']['dir_tmpl_mobile'] . "profile_view_chat.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$cmd = get_param('cmd');

if (!$user_id && $cmd != 'new')
    Common::toHomePage();

if ($user_id && User::isBlocked('im', $user_id, guid())) {
    redirect('profile_view_you_blocked.php?option=im&user_id=' . $user_id);
}

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_view_menu.html");
$profile_view_menu->user_id = $user_id;
$page->add($profile_view_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");
?>