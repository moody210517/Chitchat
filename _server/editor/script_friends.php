<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

$url_absolute = "http://".str_replace("//", "/", str_replace("_server/editor", "", str_replace("//", "/", str_replace("\\", "", $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/"))));

$id_owner = intval(get_param('id_owner'));

$e = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
$e .= "<items>";

$sql = "SELECT f.*,u.*,YEAR(FROM_DAYS(TO_DAYS('" . date('Y-m-d H:i:s') . "')-TO_DAYS(birth))) AS age FROM friends_requests AS f
LEFT JOIN user AS u ON u.user_id=IF(f.user_id='".$id_owner."', f.friend_id, f.user_id) WHERE accepted=1 AND (f.user_id='".$id_owner."' OR f.friend_id='".$id_owner."')
ORDER BY u.user_id DESC";

DB::query($sql);
while($row = DB::fetch_row()) {

	$photo_path = $url_absolute. $g['dir_files'] .User::getPhotoDefault($row['user_id'],"r");

	$e .= "<item>";
	$e .= "<userProf><![CDATA[" . $url_absolute . 'search_results.php?display=profile&name=' . $row['name'] . "]]></userProf>";
	$e .= "<photoUrl><![CDATA[" . $photo_path . "]]></photoUrl>";
	$e .= "<userAge>" . $row['age'] . "</userAge>";
	$e .= "<userName><![CDATA[" . $row['name'] . "]]></userName>";
	$e .= "</item>";

}

$e .= "</items>";

echo $e;

include($g['to_root'] . "_include/core/main_close.php");