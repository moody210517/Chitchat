<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/main_start.php");

$where = ' u.user_id != ' . to_sql(guid(), 'Number') . ' ' . $g['sql']['your_orientation'] . " AND hide_time=0 AND (DAYOFMONTH(birth)=DAYOFMONTH('" . date('Y-m-d H:i:s') . "') AND MONTH(birth)=MONTH(" . to_sql(date('Y-m-d H:i:s'), 'Text') . '))';
$order = 'near DESC, user_id';

$page = Users_List::show($where, $order, null, 'users_list_base.html');

include("./_include/core/main_close.php");