<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../../';
include("../../_include/core/main_start.php");

$server = 'tcp://' . $g['media_server'];
if($g['media_server_firewall'] == 'Y') {
    $port = 999;
    $fp = @fsockopen($server, $port, $errno, $errstr, 10);
    fwrite($fp, chr(1) . $_SERVER['REMOTE_ADDR'] . chr(0));
    fclose($fp);
}
echo 'isOk=ok&server=' . $g['media_server'];