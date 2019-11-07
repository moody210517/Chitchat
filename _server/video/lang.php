<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../../';
$g['no_headers'] = true;
include($g['to_root'] . '_include/core/main_start.php');

header('Content-Type: text/xml; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');

$pReal = $p;
$p = 'videochat.php';

echo '<lang>
	<chatroom>' . l('Room') . '</chatroom>
	<btnRooms>' . l('Rooms') . '</btnRooms>
	<users>' . l('Users') . '</users>
	<send>' . l('Send') . '</send>
</lang>';

$p = $pReal;

include($g['to_root'] . '_include/core/main_close.php');