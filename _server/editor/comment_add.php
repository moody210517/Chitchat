<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");

header("Content-Type: text/html; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

$id_owner = intval(get_param('id_owner'));
#$id = intval(get_param('id'));
$comment = get_param('comment');
$date = get_param('date_');

if ($g_user['user_id'] > 0) {
	DB::query("SELECT *, YEAR(FROM_DAYS(TO_DAYS('" . date('Y-m-d H:i:s') . "')-TO_DAYS(birth))) AS age FROM user WHERE user_id=" . $g_user['user_id'] . "", 2);
	if ($u = DB::fetch_row(2)) {
		DB::execute('DELETE FROM users_comments WHERE user_id=' . $id_owner . ' AND from_user_id=' . $g_user['user_id'] . '');
		DB::execute('INSERT INTO users_comments SET user_id=' . $id_owner . ', from_user_id=' . $g_user['user_id'] . ', comment=' . to_sql($comment, 'Text') . ', date=' . to_sql($date, 'Text'));
		echo "success";
	}
}

include($g['to_root'] . "_include/core/main_close.php");
