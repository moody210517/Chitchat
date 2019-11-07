<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$dirRoot = __DIR__ . '/../../';

include_once($dirRoot . '_include/lib/lib.php');
if (!isset($g['error_output'])) $g['error_output'] = 'browser';
error_reporting(E_ALL);
error_enable($g['error_output']);
include($dirRoot . '_include/config/db.php');
include_once($dirRoot . '_include/lib/db_common.php');
if (extension_loaded('mysqli')) {
    include_once($dirRoot . '_include/lib/db_mysqli.php');
} else {
    include_once($dirRoot . '_include/lib/db_mysql.php');
}
foreach ($_POST as $k => $v) {
      $$k = addslashes($v);
}

if(!@DB::connect()) {
    exit("Can't connect to MySql");
}