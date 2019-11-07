<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/main_start.php");

$where = "u.user_id!=" . to_sql($g_user['user_id'], "Number") . "";
$order = "v.id DESC";
$from_add = " JOIN users_view AS v ON (u.user_id=v.user_to AND v.user_from=" . to_sql($g_user['user_id'], "Number") . ")";

$page = Users_List::show($where, $order, $from_add, 'users_list_base.html');

include("./_include/core/main_close.php");