<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include_once("./_include/core/pony_start.php");

$uid = get_param('wall_uid', '');
$isSee = get_param('is_see', '');

if (Wall::isOnlySeeFriends($uid)) {
    if ($isSee == 'no') {
       echo get_json_encode('no');
    } else {
       $pageWall = Wall::ajaxPage(); 
    }
} elseif ($isSee == 'yes') {
    echo get_json_encode('no');
}

include("./_include/core/main_close.php");