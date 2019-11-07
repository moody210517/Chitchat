<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/main_start.php");

if (get_param('uid') != '') {
      $where = 'u.user_id = ' . to_sql(get_param('uid'), 'Number');
} else {
    //$defaultOnlineView = User::defaultOnlineView();
    //$filter = $defaultOnlineView != '' ? $defaultOnlineView : $g['sql']['your_orientation'];
    $filter = '';
    $where = 'u.user_id != ' . guid() . '
        AND hide_time = 0 ' . $filter. '
        AND last_visit > ' . to_sql((date("Y-m-d H:i:00", time() - $g['options']['online_time'] * 60)), 'Text');
}

$order = 'is_photo DESC, ' . Common::getSearchOrderNear() . ' user_id DESC';

$page = Users_List::show($where, $order, null, 'users_list_base.html');

include("./_include/core/main_close.php");