<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../../';
include("../../_include/core/main_start.php");

function getPhotoByName($name)
{
    global $g;
    $sql = 'SELECT user_id FROM user
        WHERE name = ' . to_sql($name, 'Text');
    $uid = DB::result($sql);
    $photo = './' . $g['dir_files'] . User::getPhotoDefault($uid, 'm');

    return $photo;
}

echo 'myPhoto=' . getPhotoByName(get_param('myLogin')) . '&enemyPhoto=' . getPhotoByName(get_param('enemyLogin'));