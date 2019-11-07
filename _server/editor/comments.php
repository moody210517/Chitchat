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
$id = intval(get_param('id'));

if ($g_user['user_id'] > 0) {
	if ($g_user['user_id'] == $id_owner) {
		DB::execute('DELETE FROM users_comments WHERE user_id=' . $id_owner . ' AND from_user_id=' . $id . '');
	} else {
		DB::execute('DELETE FROM users_comments WHERE user_id=' . $id_owner . ' AND from_user_id=' . $g_user['user_id'] . '');
	}
	echo "success";
}

include($g['to_root'] . "_include/core/main_close.php");
