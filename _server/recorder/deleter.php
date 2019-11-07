<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
$g['to_root'] = '../../';
include("../../_include/core/main_start.php");

$mod = get_param('mod', '');
$name = get_param('name', '');
$new = get_param('new', '');
$oldFile = get_param('oldFile', '');

if ($mod == '') {
    echo("No mod");
}

if ($mod == 'listen') {
    if (!$name) {
        echo("No name");
    }
    $sql = 'SELECT record_id FROM user WHERE name = ' . to_sql($name, 'Text');
    $rec = DB::result($sql);
    if ($rec) {
        echo 'num=' . $rec;
    } else {
        echo 'No user ' . $name;
    }
} elseif ($mod == 'return') {
    $sql = 'SELECT record_id FROM user WHERE user_id = ' . to_sql($g_user['user_id']);
    $rec = DB::result($sql);
    echo 'num=' . intval($rec);
} elseif ($mod == 'write') {
    if (!$new) {
        echo 'No new';
    }
    if (!$oldFile) {
        echo 'No oldFile';
    }

    $sql = 'UPDATE user SET record_id = ' . to_sql($new, 'Number') . '
        WHERE user_id = ' . to_sql(guid());
    DB::execute($sql);

    $url = 'http://' . $g['media_server'] . '/media_server/recorder.php?file=' . urlencode($oldFile);

    urlGetContents($url);

    echo 'isOk=true';
} else {
    echo('Bad mod ' . $mod);
}