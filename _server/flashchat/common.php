<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../../';
$g['no_headers'] = true;
include($g['to_root'] . '_include/core/main_start.php');

$msg_table="flashchat_messages";
$users_table="flashchat_users";
$rooms_table="flashchat_rooms";
//время в секундах после которого выкидывает
$kickTime=60*5;

$userId = to_sql(guser('user_id'));
$userLogin = to_sql(guser('name'), 'Plain');
$nowRoom = intval(get_param('nowRoom'));
$lastIDSend = intval(get_param('lastIDSend'));
$text = get_param('text');
$error = '';
$enterTime = intval(get_param('enterTime'));
$message = to_sql(get_param('message'), 'Plain');
$log =  'SELECT * FROM user WHERE user_id="' . $userId . '"';
//file_put_contents(dirname(__FILE__) . '/log.txt', $log);
