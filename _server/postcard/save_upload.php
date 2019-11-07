<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include 'conf.php';
$cont 	= to_sql($_GET["cont"], 'Plain');
$id 	= to_sql($_GET["id"]);

$pattern = '#(.*)postcard\/(.*)\.jpg#';
$filename = preg_replace($pattern, '\2', $cont);

$sql = 'INSERT INTO users_flash
    SET user_id = ' . $id . ', backgrounds = "' . $filename . '"
    ON DUPLICATE KEY UPDATE backgrounds=CONCAT(backgrounds, "|' . $filename . '")';
print "$cont - $id";
$rs = @DB::execute($sql);
if (!$rs) {
    echo "Error";
} else {
    echo "Done";
}
DB::close();