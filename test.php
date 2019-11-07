<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/main_start.php");

global $g;

$i=0;
$photos = DB::select('photo');
foreach ($photos as $photo) {
	$file = "{$g['path']['dir_files']}photo/{$photo['user_id']}_{$photo['photo_id']}_src.jpg";
	$file1 = "{$g['path']['dir_files']}photo/{$photo['user_id']}_{$photo['photo_id']}_r.jpg";
	$file2 = "{$g['path']['dir_files']}photo/{$photo['user_id']}_{$photo['photo_id']}_s.jpg";
	if (!file_exists($file) && !file_exists($file1) && !file_exists($file2)) {
		echo "{$photo['user_id']}_{$photo['photo_id']}_src.jpg";;
		echo '<br>';
		$i++;
	}
}
echo $i;

include("./_include/core/main_close.php");