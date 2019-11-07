<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
$g['to_root'] = '../../';
include("../../_include/core/main_start.php");

$name = trim(get_param('name', ''));

if ($name == '') {
	echo 'No name parameter';
} else {
    $sql = 'SELECT * FROM user WHERE name = ' . to_sql($name, 'Text');
    $uid = DB::result($sql);
	if ($uid) {
        $sql = 'UPDATE user SET record = "Y"
            WHERE user_id = ' . to_sql($uid, 'Number');
        DB::execute($sql);
		echo 'isOk=ok';
	} else {
		echo 'Not exists user ' . $name;
	}
}