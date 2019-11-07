<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт берет из базы юзеров настройки цветов. тут доступна переменная userLogin и переменные БД.
include('common.php');
DB::query("SELECT mess_color,sys_color FROM ".$users_table." WHERE user_id = " . $userId);

while(list($mess_color,$sys_color)=DB::fetch_row())  {
echo "messColor=".$mess_color."&sysColor=".$sys_color;
}